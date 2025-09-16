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
