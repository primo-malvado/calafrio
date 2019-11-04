HTML  CSS  JS  Result
EDIT ON
 class EventObserver {
  constructor() {
    this.observers = [];
  }

  subscribe(fn) {
    this.observers.push(fn);
  }

  unsubscribe(fn) {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  broadcast(data) {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}

const getWordCount = (text) => text ? text.trim().split(/\s+/).length : 0;

const wordCountElement = document.createElement('p');

wordCountElement.className = 'wordCount';
wordCountElement.innerHTML = 'Word Count: <strong id="blogWordCount">0</strong>';
document.body.appendChild(wordCountElement);

const blogObserver = new EventObserver();

blogObserver.subscribe((text) => {
  const blogCount = document.getElementById('blogWordCount');

  blogCount.textContent = getWordCount(text);
});

const blogPost = document.getElementById('blogPost');

blogPost.addEventListener('keyup', () => blogObserver.broadcast(blogPost.value));