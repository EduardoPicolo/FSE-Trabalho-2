export type dateFormats = 'numeric' | 'long'

export const formatDate = (
  date: Date | number | string,
  format: dateFormats = 'long',
  locale = 'en-US'
): string => {
  const formatMap = {
    numeric: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }
  }

  try {
    const formatedDate = new Intl.DateTimeFormat(
      locale,
      formatMap[format] as Intl.DateTimeFormatOptions
    ).format(new Date(date))

    return formatedDate
  } catch (error) {
    return '-'
  }
}
