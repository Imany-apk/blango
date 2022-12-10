

class PaginationLi extends React.Component {
  render () {
    const index = this.props.index

    let text = index
    let theLink = <a className="page-link" href={'?page=' + index}>{text}</a>
    if (index === -1) {
      text = 'Previous'
      theLink = <a className="page-link" href={'?page=' + (theCurrentPage-1)}>{text}</a>
    } else if (index === -2) {
      text = 'Next'
      theLink = <a className="page-link" href={'?page=' + (theCurrentPage+1)}>{text}</a>
    }

    let activePage = ''
    if (index == theCurrentPage) {
      activePage = ' active'
      theLink = <span className="page-link" >{text}</span>
    }
    return <li className={'page-item' + activePage}>{theLink}</li>
  }
}

class PostPagination extends React.Component {
  render () {

    const posts = this.props.posts
    
    let previous
    let pages
    let next

    if (!posts.dataLoaded) {
      return <span></span>
    }
    if (posts.data.previous !== null) {
      previous = <PaginationLi index={-1} key={-1} />
      // <li className="page-item"><a className="page-link" href={posts.data.previous}>Previous</a></li>
    }

    const pagesCount = (posts.data.count / 2) + (posts.data.count % 2)
    
    pages = [...Array(pagesCount).keys()].map(i => <PaginationLi index={i+1} key={i+1} />)

    if (posts.data.next !== null) {
      // next = <li className="page-item"><a className="page-link" href={posts.data.next}>Next</a></li>
      next = <PaginationLi index={-2} key={-2} />
    }

    return <nav aria-label="Page navigation example">
      <ul className="pagination">
        {previous}
        {pages}
        {next}
      </ul>
    </nav>
  }
}

class PostRow extends React.Component {
  render () {
    const post = this.props.post

    let thumbnail

    if (post.hero_image.thumbnail) {
      thumbnail = <img src={post.hero_image.thumbnail}/>
    } else {
      thumbnail = '-'
    }

    return <tr>
      <td>{post.title}</td>
      <td>
        {thumbnail}
      </td>
      <td>{post.tags.join(', ')}</td>
      <td>{post.slug}</td>
      <td>{post.summary}</td>
      <td><a href={'/post/' + post.slug + '/'}>View</a></td>
    </tr>
  }
}

class PostTable extends React.Component {

  render () {
    let response = this.props.posts

    let rows
    if (response.dataLoaded) {
      if (response.data.results.length) {
        rows = response.data.results.map(post => <PostRow post={post} key={post.id}/>)
      } else {
        rows = <tr>
          <td colSpan="6">No results found.</td>
        </tr>
      }
    } else {
      rows = <tr>
        <td colSpan="6">Loading&hellip;</td>
      </tr>
    }

    return <table className="table table-striped table-bordered mt-2">
      <thead>
      <tr>
        <th>Title</th>
        <th>Image</th>
        <th>Tags</th>
        <th>Slug</th>
        <th>Summary</th>
        <th>Link</th>
      </tr>
      </thead>
      <tbody>
      {rows}
      </tbody>
    </table>
  }
}

class PostParent extends React.Component {

  state = {
    dataLoaded: false,
    data: null
  }

  componentDidMount () {
    fetch(this.props.url).then(response => {
      if (response.status !== 200) {
        throw new Error('Invalid status from server: ' + response.statusText)
      }
      
      return response.json()
    }).then(data => {
      this.setState({
        dataLoaded: true,
        data: data
      })
    }).catch(e => {
      console.error(e)
      this.setState({
        dataLoaded: true,
        data: {
          results: []
        }
      })
    })
  }

  render () {
    return <div>
      <PostTable posts={this.state} />
      <PostPagination posts={this.state} />
    </div>
  }
}

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
let page = '';
let theCurrentPage = 1
if (params.page) {
  theCurrentPage = Number(params.page)
  page = '?page=' + theCurrentPage
}

const domContainer = document.getElementById('react_root')
ReactDOM.render(
  React.createElement(PostParent, {url: postListUrl + page}),
  domContainer
)