const axios = require('axios')

const print_results = (res) =>
{
    console.log(res.data.query.search)
}

axios.get('http://en.cppreference.com/mwiki/api.php?action=query&list=search&srsearch=transform&format=json')
    .then(print_results)
    .catch(console.error)