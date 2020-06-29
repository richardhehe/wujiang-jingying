<template>
  <trip-detail :is-edit="false" />
</template>

<script>
import TripDetail from './components/tripDetail'

export default {
  components: { TripDetail }
}
</script>
