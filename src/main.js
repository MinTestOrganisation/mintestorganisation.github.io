const { createApp, onMounted, ref } = Vue;

createApp({
  setup() {
    const news = ref([]);
    const loading = ref(true);
    const newsError = ref(false);
    const expandedNews = ref(null);

    const formatDate = (date) => new Intl.DateTimeFormat('sv-SE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(`${date}T12:00:00`));

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

        news.value = articles.sort((first, second) => second.date.localeCompare(first.date));
      } catch (error) {
        newsError.value = true;
        console.error(error);
      } finally {
        loading.value = false;
      }
    });

    return { news, loading, newsError, expandedNews, formatDate };
  },
}).mount('#app');