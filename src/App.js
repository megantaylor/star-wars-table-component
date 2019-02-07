import React from 'react';
import axios from 'axios';

import deathstar from './deathstar.png';
import Table from './Table';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      rows: [],
      isLoading: true,
      sortAscending: false,
      cellHeights: [],
      activeColHeader: ''
    };
  }

  componentDidMount() {
    let colData = [];
    let rowData = [];
    axios
      .get(`https://swapi.co/api/people`)
      .then(res => {
        colData = this.humanizeColHeaders(Object.keys(res.data.results[0]));
        return Promise.all(
          //loop over api response
          res.data.results.map(item => {
            return Promise.all(
              //loop over each item in the api response to return an array of values for a table row
              Object.values(item).map((data, index) => {
                if (
                  (typeof data === 'string' &&
                    data.indexOf('https://') === -1) ||
                  index === Object.values(item).length - 1
                ) {
                  // if the item is a string and not a url, except: the last field is Url, I want to display a link in that table cell
                  return data;
                } else if (
                  typeof data === 'string' &&
                  data.indexOf('https://') >= -1 &&
                  index !== Object.values(item).length - 1
                ) {
                  //if the item is a url (and not the Url field), get the name or title value from the API
                  return axios.get(data).then(data => {
                    return data.data.name || data.data.title;
                  });
                } else {
                  //if the item is an array of urls, return the name or title for each url
                  return Promise.all(
                    data.map(item => {
                      return axios.get(item);
                    })
                  ).then(data => {
                    return data.map(data => {
                      if (data.data.hasOwnProperty('episode_id')) {
                        return {
                          name: data.data.name || data.data.title,
                          episodeId: data.data.episode_id
                        };
                      }

                      return data.data.name || data.data.title;
                    });
                  });
                }
              })
            ).then(data => {
              let films = data[9];
              let newFilmObj = { titles: [], sortBy: 10 };
              films.map(item => {
                newFilmObj.titles.push(item.name);
                if (item.episodeId < newFilmObj.sortBy) {
                  newFilmObj.sortBy = item.episodeId;
                }
                return newFilmObj;
              });
              data[9] = newFilmObj;
              rowData.push(data);
            });
          })
        );
      })
      .catch(e => console.log('error: ', e))
      .then(() => {
        this.setState({
          columns: colData,
          rows: rowData,
          isLoading: false
        });
        this.handleCellHeightResize();
      });

    window.addEventListener('resize', this.handleCellHeightResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleCellHeightResize);
  }

  humanizeColHeaders = cols => {
    return cols.map(str => {
      let frags = str.split('_');
      for (let i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
      }
      return frags.join(' ');
    });
  };

  sort = (e, cellIndex, sortType) => {
    let data = this.state.rows;

    let sortOrder = this.state.activeColHeader;
    if (e.target.innerHTML !== this.state.activeColHeader) {
      sortOrder = false;
    } else {
      sortOrder = !this.state.sortAscending;
    }

    if (sortType === 'indexObjectComparator') {
      data.sort(this.indexObjectComparator(cellIndex, sortOrder));
    } else if (sortType === 'indexStringComparator') {
      data.sort(this.indexStringComparator(cellIndex, sortOrder));
    } else if (sortType === 'indexNumComparator') {
      data.sort(this.indexNumComparator(cellIndex, sortOrder));
    } else if (sortType === 'indexDateComparator') {
      data.sort(this.indexDateComparator(cellIndex, sortOrder));
    }

    this.setState(
      {
        rowData: data,
        sortAscending: sortOrder,
        activeColHeader: e.target.innerHTML
      },
      () => this.handleCellHeightResize()
    );
  };

  indexObjectComparator = (index, sortOrder) => (a, b) => {
    if (sortOrder) {
      return a[index].sortBy === b[index].sortBy
        ? 0
        : a[index].sortBy < b[index].sortBy
        ? -1
        : 1;
    } else {
      return a[index].sortBy === b[index].sortBy
        ? 0
        : a[index].sortBy > b[index].sortBy
        ? -1
        : 1;
    }
  };

  indexStringComparator = (index, sortOrder) => (a, b) => {
    if (sortOrder) {
      return a[index] === b[index] ? 0 : a[index] < b[index] ? -1 : 1;
    } else {
      return a[index] === b[index] ? 0 : a[index] > b[index] ? -1 : 1;
    }
  };

  indexNumComparator = (index, sortOrder) => (a, b) => {
    if (sortOrder) {
      return parseInt(a[index]) === parseInt(b[index])
        ? 0
        : parseInt(a[index]) < parseInt(b[index])
        ? -1
        : 1;
    } else {
      return parseInt(a[index]) === parseInt(b[index])
        ? 0
        : parseInt(a[index]) > parseInt(b[index])
        ? -1
        : 1;
    }
  };

  indexDateComparator = (index, sortOrder) => (a, b) => {
    let aDate = new Date(a[index]);
    let bDate = new Date(b[index]);
    if (sortOrder) {
      return aDate === bDate ? 0 : aDate < bDate ? -1 : 1;
    } else {
      return aDate === bDate ? 0 : aDate > bDate ? -1 : 1;
    }
  };

  getTallestCellHeights = () => {
    const rows = Array.from(this.tableElement.getElementsByTagName('tr'));
    let cellHeights = rows.map(row => {
      return Math.max(row.clientHeight) - 30;
    });
    return cellHeights;
  };

  handleCellHeightResize = () => {
    this.setState({ cellHeights: this.getTallestCellHeights() });
  };

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <p>Star Wars Characters</p>
        </header>
        {!this.state.isLoading ? (
          <div className='table-wrapper'>
            <Table
              tableRef={el => (this.tableElement = el)}
              cellHeights={this.state.cellHeights}
              columns={this.state.columns}
              rows={this.state.rows}
              sort={this.sort}
              sortAscending={this.state.sortAscending}
              activeColHeader={this.state.activeColHeader}
            />
          </div>
        ) : (
          <div className='loading'>
            <img src={deathstar} className='App-logo' alt='logo' />
          </div>
        )}
      </div>
    );
  }
}

export default App;
