<template>
  <article-detail :is-edit="false" />
</template>

<script>
import ArticleDetail from './components/activityDetail'

export default {
  name: 'CreateActivity',
  components: { ArticleDetail }
}
</script>

