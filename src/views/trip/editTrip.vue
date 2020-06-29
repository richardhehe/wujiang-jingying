<template>
  <trip-detail :is-edit="true" />
</template>

<script>
import TripDetail from './components/tripDetail'

export default {
  components: { TripDetail }
}
</script>
