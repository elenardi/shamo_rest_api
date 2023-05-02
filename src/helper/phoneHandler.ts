const phoneHandler = (number) => {
    let phone = number.trim()
    phone = phone.replace(" ","")
    phone = phone.replace("-","")
    phone = phone.replace("(","")
    phone = phone.replace(")","")
    phone = phone.replace(".","")
    phone = phone.replace("+","")

    if(phone.search(0) == 0){
        phone = phone.replace('0',62)
    }

    return phone
}

module.exports = {phoneHandler}