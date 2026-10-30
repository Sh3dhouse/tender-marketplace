(function () {
  'use strict';
  const PAGE = 'Facebook enquiries';
  const STATUSES = ['New interest', 'Contact details requested', 'Qualified', 'Quote preparation', 'Closed'];
  const HOSTS = new Set(['facebook.com', 'www.facebook.com', 'm.facebook.com', 'mbasic.facebook.com', 'basic.facebook.com']);
  const KEYS = ['facebookPosts', 'facebookEnquiries', 'facebookCRMLeads', 'leadNotes'];
  const locks = new WeakSet();
  const uuid = () => globalThis.crypto?.randomUUID?.() || `fb-${Date.now()}-${Math.random()}`;
  const stamp = () => new Date().toISOString();
  const clean = value => String(value ?? '').trim();
  const normalized = value => clean(value).normalize('NFKC').replace(/\s+/g, ' ').toLocaleLowerCase('en-NZ');
  const checked = value => value === true || value === 'on';
  function requireStaff(c) { if (c.role !== 'staff') throw Error('Facebook enquiry records are available to Shed House staff only.'); }
  function init(c) { for (const key of KEYS) c.store[key] ||= []; }
  function parseFacebookURL(value) {
    let url;
    try { url = new URL(clean(value)); } catch { throw Error('Enter a full HTTPS Facebook group post link.'); }
    if (url.protocol !== 'https:' || !HOSTS.has(url.hostname.toLowerCase()) || url.username || url.password || url.port) {
      throw Error('Use an HTTPS link on facebook.com or an approved Facebook mobile host.');
    }
    const match = url.pathname.match(/^\/groups\/([A-Za-z0-9._-]+)\/(posts|permalink)\/([A-Za-z0-9_-]+)\/?$/);
    if (!match) throw Error('Use the full group /posts/ or /permalink/ link, not a profile, share shortcut or private message.');
    const groupId = match[1].toLowerCase(), postId = match[3];
    const comments = url.searchParams.getAll('comment_id');
    const replies = url.searchParams.getAll('reply_comment_id');
    if (comments.length > 1 || replies.length > 1) throw Error('The comment link contains ambiguous comment IDs.');
    const parentCommentId = clean(comments[0]);
    const commentId = clean(replies[0] || comments[0]);
    if ([parentCommentId, commentId].some(id => id && !/^[A-Za-z0-9_-]+$/.test(id))) throw Error('The Facebook comment ID is not valid.');
    const canonicalURL = `https://www.facebook.com/groups/${groupId}/posts/${postId}/`;
    return { groupId, postId, postKey: `${groupId}/${postId}`, canonicalURL, commentId, parentCommentId };
  }
  function fallbackKey(postKey, author, text) { return JSON.stringify([postKey, normalized(author), normalized(text)]); }
  function safeSourceLink(value) {
    try {
      const parsed = parseFacebookURL(value);
      return parsed.canonicalURL + (parsed.commentId ? `?comment_id=${encodeURIComponent(parsed.parentCommentId || parsed.commentId)}${parsed.parentCommentId && parsed.parentCommentId !== parsed.commentId ? `&reply_comment_id=${encodeURIComponent(parsed.commentId)}` : ''}` : '');
    } catch { return '#'; }
  }
  function validateDate(value, label) {
    if (!value) return;
    const date = new Date(`${value}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw Error(`Enter a valid ${label} date.`);
  }
  function findDuplicate(records, candidate) {
    return records.find(record => {
      if (candidate.commentId && record.commentId) return candidate.commentId === record.commentId;
      return (record.fallbackKey || fallbackKey(record.postKey, record.author, record.originalText)) === candidate.fallbackKey;
    });
  }
  async function transaction(c, change) {
    requireStaff(c); init(c);
    if (locks.has(c.store)) throw Error('A Facebook enquiry save is already in progress. Please wait.');
    locks.add(c.store);
    const before = Object.fromEntries(KEYS.map(key => [key, JSON.parse(JSON.stringify(c.store[key]))]));
    const leadsBefore = JSON.parse(JSON.stringify(c.leads || []));
    try {
      const result = change();
      const saved = await c.save();
      if (saved === false) throw Error('Changes could not be saved. The previous records have been restored.');
      return result;
    } catch (error) {
      for (const key of KEYS) c.store[key].splice(0, c.store[key].length, ...before[key]);
      if (c.leads) c.leads.splice(0, c.leads.length, ...leadsBefore);
      throw error;
    } finally { locks.delete(c.store); }
  }
  async function registerPost(c, data) {
    requireStaff(c);
    if (!checked(data.shAuthorConfirmed) || !checked(data.publicGroupConfirmed)) throw Error('Confirm that Shed House authored this post and the group/post is public.');
    const parsed = parseFacebookURL(data.url);
    const title = clean(data.title);
    if (!title) throw Error('Enter a title for the Shed House post.');
    return transaction(c, () => {
      const duplicate = c.store.facebookPosts.find(post => post.postKey === parsed.postKey);
      if (duplicate) throw Error(`This Shed House post is already registered: ${duplicate.title} (${duplicate.id}).`);
      const record = {
        id: uuid(), postKey: parsed.postKey, groupId: parsed.groupId, facebookPostId: parsed.postId,
        url: parsed.canonicalURL, title, design: clean(data.design), campaign: clean(data.campaign),
        shAuthorConfirmed: true, publicGroupConfirmed: true, registeredAt: stamp(), source: 'Manual SH post registration'
      };
      c.store.facebookPosts.push(record); return record;
    });
  }
  async function captureEnquiry(c, data) {
    requireStaff(c);
    if (!checked(data.publicCommentConfirmed)) throw Error('Confirm this comment was visible on the registered public SH post.');
    return transaction(c, () => {
      const post = c.store.facebookPosts.find(item => item.id === data.postId && item.shAuthorConfirmed && item.publicGroupConfirmed);
      if (!post) throw Error('Choose a registered public post authored by Shed House.');
      const author = clean(data.author), originalText = String(data.originalText ?? '');
      if (!author || !originalText.trim()) throw Error('Enter the visible author name and original comment text.');
      let commentId = clean(data.commentId), parentCommentId = '', commentURL = '';
      if (commentId && !/^[A-Za-z0-9_-]+$/.test(commentId)) throw Error('Enter the original Facebook comment ID without spaces.');
      if (clean(data.commentURL)) {
        const parsed = parseFacebookURL(data.commentURL);
        if (parsed.postKey !== post.postKey) throw Error('The comment link must belong to the selected registered SH post. Use matching group/post identifiers.');
        if (commentId && parsed.commentId && parsed.commentId !== commentId) throw Error('The entered comment ID and comment link do not match.');
        commentId ||= parsed.commentId; parentCommentId = parsed.parentCommentId;
        commentURL = parsed.canonicalURL + (commentId ? `?comment_id=${encodeURIComponent(parentCommentId || commentId)}${parentCommentId && parentCommentId !== commentId ? `&reply_comment_id=${encodeURIComponent(commentId)}` : ''}` : '');
      } else if (commentId) commentURL = `${post.url}?comment_id=${encodeURIComponent(commentId)}`;
      validateDate(data.commentDate, 'comment'); validateDate(data.nextFollowup, 'follow-up');
      const key = fallbackKey(post.postKey, author, originalText);
      const candidate = { commentId, fallbackKey: key };
      const duplicate = findDuplicate(c.store.facebookEnquiries, candidate);
      if (duplicate) throw Error(`This enquiry is already captured: ${duplicate.author} (${duplicate.id}). Open the existing record to follow up.`);
      const createdAt = stamp();
      const record = {
        id: uuid(), postId: post.id, postKey: post.postKey, author, originalText, commentId, parentCommentId,
        commentURL, commentDate: clean(data.commentDate), region: clean(data.region), design: clean(data.design) || post.design,
        budget: clean(data.budget), email: clean(data.email), phone: clean(data.phone), contactSource: clean(data.contactSource),
        status: 'New interest', assignee: clean(data.assignee), nextFollowup: clean(data.nextFollowup), notes: clean(data.notes),
        createdAt, source: 'Manually captured public comment on SH-authored post', marketingConsent: 'Not recorded',
        publicCommentConfirmed: true, fallbackKey: key,
        history: [{ at: createdAt, action: 'Captured manually', status: 'New interest', notes: clean(data.notes), assignee: clean(data.assignee), nextFollowup: clean(data.nextFollowup) }]
      };
      if ((record.email || record.phone) && !record.contactSource) throw Error('Record where the customer supplied these contact details. Leave contacts blank if not supplied.');
      c.store.facebookEnquiries.push(record); return record;
    });
  }
  async function updateFollowup(c, enquiryId, data) {
    requireStaff(c);
    if (!STATUSES.includes(data.status)) throw Error('Select a valid follow-up status.');
    validateDate(data.nextFollowup, 'follow-up');
    return transaction(c, () => {
      const record = c.store.facebookEnquiries.find(item => item.id === enquiryId);
      if (!record) throw Error('The enquiry no longer exists.');
      const updatedAt = stamp();
      Object.assign(record, { status: data.status, assignee: clean(data.assignee), nextFollowup: clean(data.nextFollowup), notes: clean(data.notes), updatedAt });
      record.history ||= [];
      record.history.push({ at: updatedAt, action: 'Follow-up updated manually', status: record.status, notes: record.notes, assignee: record.assignee, nextFollowup: record.nextFollowup });
      return record;
    });
  }
  async function convertToLead(c, enquiryId) {
    requireStaff(c);
    return transaction(c, () => {
      const enquiry = c.store.facebookEnquiries.find(item => item.id === enquiryId);
      if (!enquiry) throw Error('The enquiry no longer exists.');
      const post = c.store.facebookPosts.find(item => item.id === enquiry.postId && item.shAuthorConfirmed && item.publicGroupConfirmed);
      if (!post) throw Error('CRM conversion requires its registered SH-authored public post.');
      c.leads ||= [];
      let lead = c.leads.find(item => item.sourceEnquiryId === enquiry.id) || c.store.facebookCRMLeads.find(item => item.sourceEnquiryId === enquiry.id);
      if (!lead) {
        lead = { id: uuid(), sourceEnquiryId: enquiry.id, name: enquiry.author, region: enquiry.region || 'Not supplied', source: 'Facebook · SH group post', stage: 'New lead', value: 0, email: enquiry.email, phone: enquiry.phone, marketingConsent: 'Not recorded', createdAt: stamp() };
      }
      if (!c.leads.some(item => item.sourceEnquiryId === enquiry.id)) c.leads.push(lead);
      if (!c.store.facebookCRMLeads.some(item => item.sourceEnquiryId === enquiry.id)) c.store.facebookCRMLeads.push(lead);
      enquiry.leadId = lead.id;
      if (!c.store.leadNotes.some(note => note.facebookEnquiryId === enquiry.id && note.kind === 'facebook-provenance')) {
        c.store.leadNotes.push({ id: uuid(), leadIndex: c.leads.findIndex(item => item.sourceEnquiryId === enquiry.id), leadId: lead.id, facebookEnquiryId: enquiry.id, sourceEnquiryId: enquiry.id, kind: 'facebook-provenance', source: 'Manual Facebook public comment', contact: enquiry.author, reference: enquiry.commentURL || post.url, text: `SH post: ${post.title}\nCampaign: ${post.campaign || 'Not recorded'}\nOriginal comment: ${enquiry.originalText}\nComment date: ${enquiry.commentDate || 'Not recorded'}\nContact source: ${enquiry.contactSource || 'No contact details supplied'}\nMarketing consent: not recorded.`, createdAt: stamp() });
      }
      if (!(enquiry.history || []).some(event => event.action === 'CRM lead linked')) { enquiry.history ||= []; enquiry.history.push({ at: stamp(), action: 'CRM lead linked', leadId: lead.id, status: enquiry.status, notes: 'Created or linked manually by SH. No message sent.' }); }
      return lead;
    });
  }
  function esc(c, value) { return c.escape(String(value ?? '')); }
  function input(c, label, name, value = '', attributes = '') { return `<label>${label}<input name="${name}" value="${esc(c, value)}" ${attributes}></label>`; }
  const card = (title, content) => `<section class="card fb-card"><h2>${title}</h2>${content}</section>`;
  function panel(c) {
    if (c.role !== 'staff') return '';
    init(c);
    const active = c.store.facebookEnquiries.filter(item => item.status !== 'Closed');
    return `<section class="card fb-panel"><div><div class="eyebrow">FACEBOOK / SH GROUP POSTS</div><h2>Turn public interest into a conversation.</h2><p>${c.store.facebookPosts.length} SH posts · ${active.length} active enquiries · ${c.store.facebookEnquiries.filter(item => item.leadId).length} CRM leads linked</p><p class="small">Manual capture and follow-up only. No Facebook connection or messages sent.</p></div><button class="primary" data-fb-open>Review Facebook enquiries →</button></section>`;
  }
  function bindPanel(c) { if (c.role === 'staff') document.querySelectorAll('[data-fb-open]').forEach(button => button.onclick = () => c.navigate(PAGE)); }
  function render(page, c) {
    if (c.role !== 'staff' || page !== PAGE) return '';
    init(c); const e = value => esc(c, value), posts = c.store.facebookPosts, enquiries = c.store.facebookEnquiries;
    return `<div class="fb-module"><div class="heading"><div><div class="eyebrow">SHED HOUSE / SALES & CRM</div><h1>Public interest. A clear next step.</h1><p>Manually capture enquiries from registered Shed House posts in public Facebook groups.</p></div><span class="tag amber">SH staff only</span></div>${panel(c)}<div class="banner"><div><h2>Only your own public group posts</h2><p>Register a post authored by Shed House before recording its comments. Capture only visible enquiries on that post. Contact details are optional and must have been supplied by the customer; marketing consent is not inferred.</p><p class="small">This workspace does not connect to Facebook, scrape comments or send messages. Private posts and posts authored by others are outside this workflow.</p></div></div><div class="fb-grid">${card('Register a Shed House post', `<form id="fb-post" class="fb-form">${input(c, 'Full public Facebook group post link', 'url', '', 'type="url" required placeholder="https://www.facebook.com/groups/…/posts/…/"')}${input(c, 'SH post title', 'title', '', 'required')}${input(c, 'Design / model promoted', 'design')}${input(c, 'Campaign / promotion reference', 'campaign')}<label class="fb-check"><input name="shAuthorConfirmed" type="checkbox" required> Shed House authored this post.</label><label class="fb-check"><input name="publicGroupConfirmed" type="checkbox" required> The group and this post are public.</label><button class="primary">Register SH post</button></form><p class="small">Use the full post/permalink URL. Tracking parameters are removed. Use the same group identifier for post and comment links; group-name aliases cannot be resolved without Facebook access.</p><div class="fb-records">${posts.map(post => `<article><h3>${e(post.title)}</h3><p>${e(post.design || 'Design not recorded')} · ${e(post.campaign || 'Campaign not recorded')}</p><a href="${e(safeSourceLink(post.url))}" target="_blank" rel="noopener noreferrer">Open registered SH post ↗</a><p class="small">${e(post.id)} · ${e(post.registeredAt)}</p></article>`).join('') || '<p>No SH posts registered yet.</p>'}</div>`)}${card('Capture an enquiry manually', `<form id="fb-enquiry" class="fb-form"><label>Registered SH public post<select name="postId" required><option value="">Select SH post</option>${posts.map(post => `<option value="${e(post.id)}">${e(post.title)}</option>`).join('')}</select></label>${input(c, 'Visible commenter name', 'author', '', 'required')}<label>Original comment text<textarea name="originalText" required></textarea></label>${input(c, 'Comment link (optional)', 'commentURL', '', 'type="url"')}${input(c, 'Original comment ID (optional)', 'commentId')}${input(c, 'Comment date (if known)', 'commentDate', '', 'type="date"')}<div class="fb-fields">${input(c, 'Region (if supplied)', 'region')}${input(c, 'Design interest (if supplied)', 'design')}${input(c, 'Budget information (if supplied)', 'budget')}${input(c, 'Assigned SH team member', 'assignee')}${input(c, 'Next follow-up', 'nextFollowup', '', 'type="date"')}</div><details><summary>Customer-supplied contact details (optional)</summary>${input(c, 'Email supplied by customer', 'email', '', 'type="email"')}${input(c, 'Phone supplied by customer', 'phone')}${input(c, 'Where / when the customer supplied details', 'contactSource')}<p class="small">Leave blank when not provided. Recording contact details does not record marketing consent.</p></details><label>Internal notes<textarea name="notes"></textarea></label><label class="fb-check"><input name="publicCommentConfirmed" type="checkbox" required> This comment was visible on the selected SH-authored public post.</label><button class="primary" ${posts.length ? '' : 'disabled'}>Capture enquiry</button></form>`)}</div>${card('Enquiry follow-up register', `<div class="fb-status-key">${STATUSES.map(status => `<span class="tag ${status === 'New interest' ? 'amber' : 'grey'}">${e(status)} · ${enquiries.filter(item => item.status === status).length}</span>`).join('')}</div>${enquiries.slice().reverse().map(record => enquiryHTML(record, c)).join('') || '<p>Register an SH post and capture a comment to begin.</p>'}`)}</div>`;
  }
  function enquiryHTML(record, c) {
    const e = value => esc(c, value), post = c.store.facebookPosts.find(item => item.id === record.postId);
    return `<article class="fb-enquiry"><div class="card-top"><div><h3>${e(record.author)}</h3><p class="small">${e(record.id)} · ${e(post?.title || 'Registered post unavailable')}</p></div><span class="tag ${record.status === 'New interest' ? 'amber' : 'grey'}">${e(record.status)}</span></div><blockquote>${e(record.originalText)}</blockquote><p>${e(record.region || 'Region not supplied')} · ${e(record.design || 'Design not supplied')} · ${e(record.budget || 'Budget not supplied')}</p>${record.commentURL ? `<a href="${e(safeSourceLink(record.commentURL))}" target="_blank" rel="noopener noreferrer">Open source comment ↗</a>` : post ? `<a href="${e(safeSourceLink(post.url))}" target="_blank" rel="noopener noreferrer">Open registered SH post ↗</a>` : ''}<p class="small">Comment date: ${e(record.commentDate || 'Not recorded')} · Captured ${e(record.createdAt)}</p>${record.email || record.phone ? `<p class="small">Supplied contact: ${e(record.email)} ${e(record.phone)} · Source: ${e(record.contactSource)}</p>` : ''}<form data-fb-followup="${e(record.id)}" class="fb-followup"><label>Follow-up status<select name="status">${STATUSES.map(status => `<option ${record.status === status ? 'selected' : ''}>${e(status)}</option>`).join('')}</select></label>${input(c, 'Assigned to', 'assignee', record.assignee)}${input(c, 'Next follow-up date', 'nextFollowup', record.nextFollowup, 'type="date"')}<label class="fb-wide">Follow-up notes<textarea name="notes">${e(record.notes)}</textarea></label><button class="secondary">Save follow-up</button><button type="button" class="primary" data-fb-convert="${e(record.id)}">${record.leadId ? 'CRM lead linked ✓' : 'Create / link CRM lead'}</button></form><p class="small">Contact requested is a manually recorded status; no message is sent. CRM value starts at NZD 0 until SH qualifies the opportunity.</p><details><summary>Follow-up history · ${(record.history || []).length} events</summary>${(record.history || []).slice().reverse().map(event => `<div class="fb-history"><strong>${e(event.action)} · ${e(event.status)}</strong><p>${e(event.notes)}</p><span class="small">${e(event.at)} · ${e(event.assignee)}${event.nextFollowup ? ` · Follow-up ${e(event.nextFollowup)}` : ''}</span></div>`).join('')}</details></article>`;
  }
  function bind(page, c) {
    if (c.role !== 'staff' || page !== PAGE) return;
    init(c); bindPanel(c);
    const run = async (button, action, message) => {
      if (button) button.disabled = true;
      try { await action(); c.toast(message); c.navigate(PAGE); }
      catch (error) { c.toast(error.message || 'Unable to save this enquiry.'); }
      finally { if (button) button.disabled = false; }
    };
    const postForm = document.querySelector('#fb-post');
    if (postForm) postForm.onsubmit = event => { event.preventDefault(); run(event.submitter, () => registerPost(c, Object.fromEntries(new FormData(postForm))), 'SH public post registered'); };
    const enquiryForm = document.querySelector('#fb-enquiry');
    if (enquiryForm) enquiryForm.onsubmit = event => { event.preventDefault(); run(event.submitter, () => captureEnquiry(c, Object.fromEntries(new FormData(enquiryForm))), 'Facebook enquiry captured manually'); };
    document.querySelectorAll('[data-fb-followup]').forEach(form => form.onsubmit = event => { event.preventDefault(); run(event.submitter, () => updateFollowup(c, form.dataset.fbFollowup, Object.fromEntries(new FormData(form))), 'Follow-up saved; no message sent'); });
    document.querySelectorAll('[data-fb-convert]').forEach(button => button.onclick = () => run(button, () => convertToLead(c, button.dataset.fbConvert), 'CRM lead linked with source provenance'));
  }
  window.SHFacebookEnquiries = { pages: [PAGE], render, bind, panel, bindPanel, parseFacebookURL, fallbackKey, findDuplicate, actions: { registerPost, captureEnquiry, updateFollowup, convertToLead } };
})();
