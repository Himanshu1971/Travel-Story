import no_filter_data_img from "../assets/Images/no-filter-data.png";
import no_search_data_img from "../assets/Images/no-search-data.png";
import emptyImage from "../assets/Images/emptyImage.png"

export const validateEmail = (email) =>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


export const getInitials = (name) => {
    if(!name) return "";

    const words = name.split(" ");
    let initials = "";
    
    for(let i=0;i<Math.min(words.length,2);i++){
        initials += words[i][0];
    }

    return initials.toUpperCase();
}

export const getEmptyCardMessage = (filterType) => {
    switch(filterType){
        case "search" :
            return `Oops! No Stories found Matching your Search.`;
        
        case "date" : 
            return `No stories found in the given date range`;

        default:
            return `Start creating your first Travel Story! Click the 'Add' button to jot down your thoughts,ideas, and memories. Lets get started! `;
    }

}

export const getEmptyCardImg = (filterType) => {
    console.log(no_filter_data_img,no_search_data_img,emptyImage);
    switch (filterType) {
        case "search":
            return no_search_data_img;

        case "date":
            return no_filter_data_img;

        default:
            return emptyImage;
    }
}