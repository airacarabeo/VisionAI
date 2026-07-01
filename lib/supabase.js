const SUPABASE_URL = 'https://lewdqibwxdelpampowdo.supabase.co/rest/v1';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxld2RxaWJ3eGRlbHBhbXBvd2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4ODg1ODUsImV4cCI6MjA5ODQ2NDU4NX0.p02I3AtEq0RTxWCbf8TBOHks4PO_Tvg4PpmRtW4C0Ow';

function createQuery(tableName) {
  const searchParams = new URLSearchParams();

  return {
    select(columns = '*') {
      searchParams.set('select', columns);
      return this;
    },
    async order(column, options = {}) {
      const direction = options.ascending === false ? 'desc' : 'asc';
      searchParams.set('order', `${column}.${direction}`);

      try {
        const response = await fetch(`${SUPABASE_URL}/${tableName}?${searchParams.toString()}`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          return { data: null, error: data };
        }

        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
  };
}

const supabase = {
  from(tableName) {
    return createQuery(tableName);
  },
};

export default supabase;
