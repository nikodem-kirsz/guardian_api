// import './styles/main.css';

// Please use https://open-platform.theguardian.com/documentation/

class GuardianNewsApiService {
  static getNews(query, pageNum = 1) {
    function getUri(query) {
      return `https://content.guardianapis.com/search?${query}&page=${pageNum}&api-key=92dfc660-4c2c-4656-99c6-26f62b24ac60`;
    }

    function constructQuery(query) {
      return query + fromLastGivenDays();
    }

    function fromLastGivenDays(days = 30) {
      let date = new Date();
      date.setDate(date.getDate() - days);
      return `&from-date=${date.toISOString().split('T')[0]}`;
    }

    return (async function () {
      try {
        const response = await fetch(getUri(constructQuery(query)));
        const json = await response.json();
        pageNum++;
        return json.response.results;
      } catch (e) {
        console.error(e);
      }
    })();
  }
}

async function fetchNewsFeed(query = '', page = 1) {
  try {
    const articles = await GuardianNewsApiService.getNews(query, page);
    let newsList = document.getElementsByClassName('newsList')[0];
    while (newsList.firstChild) {
      newsList.removeChild(newsList.firstChild);
    }
    createArticleSection(articles);
  } catch (e) {
    console.error(e);
  }
}

function createArticleSection(articles) {
  let newsList = document.getElementsByClassName('newsList')[0];

  articles.map((article) => {
    let newsElement = document.createElement('li');

    let news = document.createElement('article');
    news.classList.add('news');

    newsElement.appendChild(news);

    let header = document.createElement('header');
    news.appendChild(header);

    let newsTitle = document.createElement('h3');
    newsTitle.innerText = article['webTitle'];
    header.appendChild(newsTitle);

    let newsDetails = document.createElement('section');
    newsDetails.classList.add('newsDetails');
    let detailsList = document.createElement('ul');
    news.appendChild(newsDetails);
    newsDetails.appendChild(detailsList);

    let sectionElement = document.createElement('li');
    let sectionName = document.createElement('strong');
    sectionElement.innerText = article['sectionName'];
    sectionName.innerText = 'Section Name: ';
    detailsList.appendChild(sectionElement);
    sectionElement.appendChild(sectionName);

    let publicationDateElement = document.createElement('li');
    let publicationDateTitle = document.createElement('strong');
    publicationDateElement.innerText = article['webPublicationDate'];
    publicationDateTitle.innerText = 'Publication Date: ';
    publicationDateElement.appendChild(publicationDateTitle);
    detailsList.append(publicationDateElement);

    let newsAction = document.createElement('section');
    newsAction.classList.add('newsActions');
    let fullArticle = document.createElement('a');
    fullArticle.href = article['webUrl'];
    fullArticle.classList.add('button');
    fullArticle.innerText = 'Full article';
    let readLaterButton = document.createElement('button');
    readLaterButton.classList.add('button', 'button-outline');
    readLaterButton.innerText = 'Read Later';

    readLaterButton.addEventListener('click', (e) => {
      console.log(e);
      let savedNewsElement = document.createElement('li');
      let savedNewsTitle = document.createElement('h4');
      savedNewsTitle.innerText = article['webTitle'];
      let savedNewsAction = document.createElement('section');
      let readHref = document.createElement('a');
      readHref.classList.add('button', 'button-clear');
      readHref.href = article['webUrl'];
      readHref.innerText = 'Read';
      let removeButton = document.createElement('button');
      removeButton.classList.add('button', 'button-clear');
      removeButton.innerText = 'Remove';
      removeButton.addEventListener('click', (e) => {
        e.path[2].remove();
      });
      savedNewsElement.appendChild(savedNewsTitle);
      savedNewsAction.appendChild(readHref);
      savedNewsAction.appendChild(removeButton);
      savedNewsElement.appendChild(savedNewsAction);
      document
        .getElementsByClassName('readLaterList')[0]
        .append(savedNewsElement);
    });
    news.appendChild(newsAction);

    newsAction.appendChild(fullArticle);
    newsAction.appendChild(readLaterButton);
    newsList.appendChild(newsElement);
  });
}

// Event handlers

document
  .getElementById('newsContentSearch')
  .addEventListener('input', async (e) => {
    const value = e.target.value;
    const section = document.getElementById('sectionSelect').value;
    const query = `q=${value}&section=${section === 'all' ? '' : section}`;
    try {
      await fetchNewsFeed(query);
    } catch (e) {
      console.error(e);
    }
  });

document
  .getElementById('sectionSelect')
  .addEventListener('change', async (e) => {
    const value = e.target.value;
    const query = `section=${value}`;
    try {
      await fetchNewsFeed(value === 'all' ? '' : query);
    } catch (e) {
      console.error(e);
    }
  });

document
  .getElementById('activePageSelect')
  .addEventListener('change', async (e) => {
    const value = e.target.value;
    const section = document.getElementById('sectionSelect').value;
    let query = `section=${section}`;
    try {
      await fetchNewsFeed(section === 'all' ? '' : query, value);
    } catch (e) {
      console.error(e);
    }
  });

// Initial empty query request to guardian returning all content

(async () => {
  await fetchNewsFeed();
})();
