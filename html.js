module.exports = (term)=>[`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SteamSales</title>
  <style>
    table,
    td {
        border: 1px solid #333;
      }
      
      thead,
      tfoot {
        background-color: #333;
        color: #fff;
      }
      th,td{

        padding:6px;
      }

  </style>
</head>
<body>
  <h1> Steam Sales for term '${term}'</h1>
  <h2>date:${new Date().toDateString()}</h2>
  <table>
    <thead>
        <tr>
            <th >Title</th>
            <th >Discount</th>
            <th >Sale price</th>
            <th >Normal price</th>
        </tr>
    </thead>
    <tbody id='tbody'>
    `,`
    </tbody>
  </table>
</body>
`]