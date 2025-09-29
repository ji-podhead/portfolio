import localforage from "localforage";
export default function SafeToLocalcStorage(name,value) {
    return new Promise((resolve, reject) => {
        localforage.setItem(JSON.stringify(name), value).then(() => {
            localforage.getItem(JSON.stringify(name)).then(
                function (value) {
                    resolve(console.log("item: "+  name +"received from localStorage" + JSON.stringify(value)))
            
            }).catch(function (err) {
                reject(console.log("gotError while getting variable back from localstorage!!" + err))
            });
        })

    })

} 