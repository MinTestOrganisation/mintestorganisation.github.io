const { createApp, onMounted, ref } = Vue;

const sections = [
  { slot: 'news-slot', file: './news.html' },
  { slot: 'about-slot', file: './about.html' },
];

async function loadLayout() {
  const response = await fetch(new URL('./layout.html', import.meta.url));
  if (!response.ok) throw new Error('Page layout could not be loaded');
  document.getElementById('app').innerHTML = await response.text();
}

async function loadSections() {
  await Promise.all(sections.map(async ({ slot, file }) => {
    const response = await fetch(new URL(file, import.meta.url));
    if (!response.ok) throw new Error(`Section could not be loaded: ${file}`);
    document.getElementById(slot).innerHTML = await response.text();
  }));
}

async function mountSite() {
  try {
    await loadLayout();
    await loadSections();
  } catch (error) {
    console.error(error);
    const slots = document.querySelectorAll('[data-section]');
    if (slots.length) {
      slots.forEach((slot) => {
        slot.textContent = 'Innehållet kunde inte hämtas just nu.';
      });
    } else {
      document.getElementById('app').textContent = 'Sidan kunde inte hämtas just nu.';
    }
    return;
  }

  createApp({
    setup() {
      const news = ref([]);
      const loading = ref(true);
      const newsError = ref(false);
      const expandedNews = ref(null);

      const articleText = (item) => (item.body || []).filter(Boolean).join(' ');
      const previewText = (item) => {
        const text = articleText(item);
        return text.length > 180 ? `${text.slice(0, 180).trimEnd()}...` : text;
      };
      const hasMore = (item) => articleText(item).length > 180 || (item.body?.length || 0) > 1;

      const formatDate = (datetime) => new Intl.DateTimeFormat('sv-SE', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'Europe/Stockholm',
      }).format(new Date(datetime));

      onMounted(async () => {
        try {
          const indexResponse = await fetch(new URL('../news/index.json', import.meta.url));
          if (!indexResponse.ok) throw new Error('News index could not be loaded');

          const filenames = await indexResponse.json();
          const articles = await Promise.all(filenames.map(async (filename) => {
            const response = await fetch(new URL(`../news/${filename}`, import.meta.url));
            if (!response.ok) throw new Error(`News article could not be loaded: ${filename}`);
            return response.json();
          }));

          news.value = articles.sort((first, second) => new Date(second.datetime) - new Date(first.datetime));
        } catch (error) {
          newsError.value = true;
          console.error(error);
        } finally {
          loading.value = false;
        }
      });

      return { news, loading, newsError, expandedNews, formatDate, previewText, hasMore };
    },
  }).mount('#app');
}

mountSite();