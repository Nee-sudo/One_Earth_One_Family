# TODO - Google Play Child Safety Compliance System (One Earth One Family)

## Phase 1: Public child-safety + reporting pages
- [ ] Edit `views/policy.ejs` add “Report a Safety Concern” link pointing to `/report-safety`.
- [ ] Create `views/child-safety.ejs` content exactly as specified.
- [ ] Create `views/report-safety.ejs` UI (categories, reasons, evidence uploads, 500 char limit, submit success message).
- [ ] Add Express routes for `/child-safety` and `/report-safety` in `server.js` (no login required).

## Phase 2: Backend Report system
- [ ] Create `models/Report.js` schema with required fields.
- [ ] Add secure report submission endpoint `POST /api/reports/submit`.
  - [ ] Server-side validation + sanitization
  - [ ] Rate limiting / CAPTCHA-like protection
  - [ ] Duplicate report prevention
  - [ ] Secure file upload handling + evidence storage
  - [ ] Audit logging (report creation)
- [ ] Implement priority assignment rules.
- [ ] Implement child-safety workflow (highest priority, immediate queue, prevent deletion-before-review, evidence preservation).

## Phase 3: Admin moderation dashboard
- [ ] Add admin-only access control (role check) using existing JWT auth.
- [ ] Create moderation dashboard page/view with required sections.
- [ ] Implement moderator actions backend endpoints:
  - [ ] View content
  - [ ] Remove content
  - [ ] Warn user
  - [ ] Suspend account
  - [ ] Permanently ban account
  - [ ] Dismiss report
  - [ ] Add moderator notes
- [ ] Implement audit logging for moderation actions.

## Phase 4: In-app reporting buttons + dialog prefill
- [ ] Inspect existing post/comment/message/profile rendering code.
- [ ] Add “Report …” options for:
  - [ ] User Profile (⋮ -> Report User)
  - [ ] Posts (⋮ -> Report Post)
  - [ ] Comments (Report Comment)
  - [ ] Messages (long press -> Report Message)
  - [ ] Images (Report Image)
  - [ ] Videos (Report Video)
- [ ] Ensure each opens the same reporting dialog with pre-filled category/reason.
- [ ] Ensure `/report-safety` reads query params to pre-fill form.

## Phase 5: Policy documents updates
- [ ] Add “Child Safety” sections to Community Guidelines and Terms of Service.
- [ ] Update Privacy Policy with “Safety Reporting” section.

## Phase 6: Accessibility & performance quick pass
- [ ] Ensure pages are responsive, keyboard navigable, screen reader labels.
- [ ] Ensure dark mode compatible with existing CSS.
- [ ] Validate lazy loading where needed.

## Phase 7: Testing checklist
- [ ] Verify public pages work without login.
- [ ] Verify report submission success/error messages.
- [ ] Verify reports stored and priorities assigned.
- [ ] Verify admin dashboard lists and moderator actions work.
- [ ] Verify no existing functionality breaks.

