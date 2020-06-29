<template>
  <article-detail :is-edit="true" />
</template>

<script>
import ArticleDetail from './components/activityDetail'

export default {
  name: 'EditActivity',
  components: { ArticleDetail }
}
</script>

