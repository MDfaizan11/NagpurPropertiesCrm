import React from "react";
import "../Stock/stock.css";
function Stock() {
  // function reverceString(sentence) {
  //   console.log(sentence);
  //   const word = sentence.split(" ");
  //   console.log(word);
  //   const reverseMap = word.map((item) => item.split("").reverse().join(""));
  //   const result = reverseMap.join(" ");
  //   console.log(result);
  //   return result;
  // }

  // reverceString("hello faizan");

  function reverse(newWord) {
    console.log(newWord);
    const result = newWord.split("").reverse().join("");
    console.log(result);
  }
  reverse("faizan");
  
  return <div>Stock</div>;
}

export default Stock;
