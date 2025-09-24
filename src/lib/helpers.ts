
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
        export const handleCopy = (link:string) => {
        if (typeof window === "undefined"){
                return
        }
                navigator.clipboard.writeText(link);
                return true;
              
                
      };
       export const handleShare = (link: string,name:string) => {
        if (navigator.share) {
          navigator
            .share({
              title: `"Check out  ${name} on ShopCheap!`,
              text: "Hey, take a look at this:",
              url: link,
            })
            .then(() => console.log("Shared successfully"))
            .catch((error) => console.error("Error sharing", error));
        } else {
                handleCopy(link)
                alert("Sharing not supported on this device. Try copying the link instead.");
        }
      };

      