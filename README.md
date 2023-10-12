# Introduction 👋

The Chart Tool is a dumb and basic tool to simply generate charts using the provided data with minimal customization options. Built to run fully on the client side, with no backend, the data entered by users is not saved anywhere. You refresh, everything's lost.

The goal of the project (web page?) was just to test out the data grid offered by Handsontable and just evolved into this.

# Get Started! 🚀

### Setting up the app

1. Clone the repository by running the below command:

   ```
   gh repo clone shahrozn/thecharttool
   ```

   Alternatively, you can download the zip file of the source code and use that as well.
2. Open `index.html` from the root folder or start a server to host it.
3. And that's it!

*There's a hosted version available as well on GitHub pages [here](https://shahrozn.github.io/thecharttool/).*

### Using The Chart Tool

Follow these easy steps to get started ~

* Copy your data from the source (preferably a spreadsheet) and paste it in the data grid below.
* Make adjustments as required. Try not to have any empty rows/columns. (If you have missing data, make sure the cells are either empty or have "null" in them.)
* Hit **Update Headers** on the left panel under "Data Options" section and select Span Gaps if you want two points connected which have a null value between them.
* Make required adjustments under the "Visual Options" section as well. You can select the chart type, colors, set the title/subtitle and the chart's dimensions as well.
* Once you're done, hit **Plot** and bam! You should have your chart.
* Next up you can try the **Analyze** feature and/or download the result.

#### What's up with the SQL?

I needed to dummy data frequently for tests in BigQuery and thought it would be great to have something to automatically generate ready-to-run queries. I ended up just adding a quick function for it here. 

To use it, 

1. Add your data to the grid. (Make sure that the column headers match against the table headers.)
2. Click on **SQL?**.
3. In the popup, type in the table's name and hit **Generate SQL Query**.
4. And viola! The query should appear in an editable field under it.

*Disclaimer: The query generated is generic and works with BigQuery. It may or may not be compatible with your database. In addition to that, the function only specifically handles strings and adds in the necessary quotation marks. There are no specific handlers added for any other data types.*

# In the workshop (maybe) 🛠️

- Support for *Combo Chart*
- Ability to add multiple charts
- Options for adjusting chart axis & grid
- Option to add trendlines
- Options for forecasting data
- Enhance the insights with something more solid (unsure of what)
