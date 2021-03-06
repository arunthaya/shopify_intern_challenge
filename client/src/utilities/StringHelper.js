const helpers = {
  isEmpty: function (str) {
    if (!str) return true
    else if (str.length === 0) return true
    else if (/^\s*$/.test(str)) return true
    else if (!str.trim()) return true
    return false
  },
  isSameSearch: function (str1, str2, results) {
    if (str1.trim() === str2 && results.length !== 0) {
      return true
    }
    if (helpers.isEmpty(str1)) {
      return true
    }
  }
}

export default helpers
