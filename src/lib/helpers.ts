export const formatDate = (dateString: number) => {
        if (dateString ===0) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

    export const truncateString = (text: string, maxLength: number): string => {
                return text.length > maxLength ? text.slice(0, maxLength) + " . . ." : text;
              };

  export const fetchClientSecret = async() => {
  return fetch('api/create-checkout-session', {method: 'POST'})
    .then((response) => response.json())
    .then((json) => json.checkoutSessionClientSecret)
};