var str = "https://waytolearnx.com/t.html?name=alex-babtise&age=25&address=paris";
var url = new URL(str);
var id_product = url.searchParams.get("id");
console.log(id_product);