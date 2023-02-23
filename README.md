# docu-gpt

## Premise

A lot of companies (still) revolve around using Excel / Google Sheets / other spreadsheet alternatives for creating legal documents.
Using ChatGPT can help fill in placeholder values for document templates.
Further more, we can containerize a "persona" for any entity that we are filling a document for. Example:
- For a small company (e.g. one employee, you!), there would be only one person, namely your company
- For a medium-sized company, we start to have other employees. We can save them some time be pre-filling legal documents for them, for example. Also, if this company starts having multiple clients, you can see how this can become very useful very fast.
- 
Idea: The concept of threads/discussions used by OpenAI's ChatGPT can come in in this "containerization".

Usually, filling documents is based on replacing placeholder character formations (such as "...", "......", "________" etc.) with your own information. Each time we encounter such a group of characters, we can ask ChatGPT to do 2 things for us:
1. If you have any apropri information about us, please fill it in for us
2. If you don't, can you give a _VARIABLE_ name that would suit this placeholder value?

A variable, in this context, would be the atomic unit of the user's "persona". Since ChatGPT will complete the blank fields for us, why not also ask him to name the variables that will hold these values?

## Next steps

- [ ] fetch spreadsheet values (& format, namely info regarding cell merging) from google sheets
- [ ] add these values in some sort of representation layer (not a spreadsheet implementation just yet)
- [ ] run main instruction on resulted formatted lines
- [ ] with saved format from 1st step, feed back data into Google Sheets spreadsheet (you can do the same for an XLSX file)
- [ ] run export POST route => PDF file


## Future ideas

- monthly documents generation -> do you have some time-variable data to insert in your document?
- you can use ChatGPT to insert other data in form of cells / tables