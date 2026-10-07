# v0.14.6 Release Notes

### 🐛 Bug Fixes

- **Document Page Navigation**: Fixed an issue where `list_document_pages` returned an empty list when requesting lightweight page names (`detail_level: "names"`). All pages and nested sub-pages are now properly discovered and returned with IDs and hierarchy info, allowing AI agents to quickly inspect doc structures without token-heavy full-content downloads.
