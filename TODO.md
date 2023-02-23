- [x] put fetched text in a spreadsheet
  - [ ] will have to implement merged cells at some point, which react-spreadsheet does not support yet
- [ ] implement access_token refresh for next-auth
  - quick fix: delete account entry from the table and re-login
- [ ] integrate OpenAI
- [ ] finish google drive picker


User journey:
1. Show google drive picker
2. User chooses a spreadsheet
3. capture spreadsheetId -> fetch using `getSpreadsheetValuesById` query
4. paint values in spreadsheet component
5. run text in ChatGPT
   1. IDEA: we can generate ASCII table for chat gpt prompt. This can help with table context, like this scenario:

```
    +-------+------+----------+
    | Index | Name | Contract |
    +-------+------+----------+
    |     1 | A    |  ......  |
    |     2 | B    |          |
    +-------+------+----------+
```
6. run diff between original template vs the new one filled with values
7. (!!!) do the hover thingy over differences
   1. 
8. (OPTIONAL) let user fill other cells
9.  user clicks export -> bulk write to a new spreadsheet in user's Google Drive
10. export to pdf from this new spreadsheet
11. serve pdf to client & delete temporary spreadsheet