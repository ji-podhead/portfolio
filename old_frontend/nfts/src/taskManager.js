import { FC, useRef, useEffect, useMemo, useState } from 'react'
import { setCurrentAreaNodes, setSelectedStore, State } from './features/counter/counterSlice'
import { useDispatch, useSelector } from 'react-redux'
import schneider from "./schneider.json"
import schlüssel from "./schlüssel.json"
import schuh from "./schuh.json"
import { ImageLoader } from './imageLoader'
import opening_hours from "opening_hours";
//<img src={require("./images/schneider/hemd0.jpg")} className='w-full h-full bg-green' alt="logo" />
const imageMap = ImageLoader()
const days = { Mo: { name: "Montag", index: 0 }, Tu: { name: "Dienstag", index: 1 }, We: { name: "Mittwoch", index: 2 }, Th: { name: "Donnerstag", index: 3 }, Fr: { name: "Freitag", index: 4 }, Sa: { name: "Samstag", index: 5 }, Su: { name: "Sonntag", index: 6 } }
const tage = { Montag: { index: 0, engl: "Monday", short: "Mo" }, Dienstag: { engl: "Tuesday", index: 1, short: "Tu" }, Mittwoch: { engl: "Wednesday", index: 2, short: "We" }, Donnerstag: { endl: "Thursday", index: 3, short: "Th" }, Freitag: { engl: "Friday", index: 4, short: "Fr" }, Samstag: { engl: "Saturday", index: 5, short: "Sa" }, Sonntag: { engl: "Sunday", index: 6, short: "Su" } }
const tageArray = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag",]
const monateArray = ["Januar", "Februar", "März", "April", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
const months = {
    "Jan": { index: 0 }, "Feb": { index: 1 }, "Mar": { index: 2 },
    "Apr": { index: 3 }, "May": { index: 4 }, "Jun": { index: 5 },
    "Jul": { index: 6 }, "Aug": { index: 7 }, "Sep": { index: 8 },
    "Oct": { index: 9 }, "Nov": { index: 10 }, "Dez": { index: 11 }
}
const aufgaben = {
    kürzen: {
        color: "",
        icon: {},
        kleidungsStuecke: new Map(),
        kurzBeschreibung: "",
    },
    reißverschlussErsetzen: {
        color: "",
        icon: {},
        kleidungsStuecke: new Map(),
        kurzBeschreibung: "",
    },
    lochFlicken: {
        color: "",
        icon: {},
        kleidungsStuecke: new Map(),
        kurzBeschreibung: "",
    },
    wäscheLabel: {
        art: ["LaserPrint", "StickMuster"],
        kleidungsStuecke: new Map(),
        kurzBeschreibung: "",
    },
    herstellung: {
        kleidungsStuecke: new Map(),
        kurzBeschreibung: "",
    },
    verkauf: {
        kleidungsStuecke: new Map(),
        kurzBeschreibung: "",
        Marken: ["polo", "gucci", "bugatti", "arbeitsKleidung"]
    }
}
const kleidungsStuecke1 = {
    hose: { stoff: {}, beschreibung: "", preis: -1, fotos: [] },
    mantel: { stoff: {}, beschreibung: "", preis: -1, fotos: [] },
    jacke: { stoff: {}, beschreibung: "", preis: -1, fotos: [] },
    hut: { stoff: {}, beschreibung: "", preis: -1, fotos: [] },
    bluse: { stoff: {}, beschreibung: "", preis: -1, fotos: [] },
    hemd: { stoff: {}, beschreibung: "", preis: -1, fotos: [] },
    tShirt: { stoff: {}, beschreibung: "", preis: -1, fotos: [] },
    unterWäsche: { stoff: {}, beschreibung: "", preis: -1, fotos: [] },
    weste: { stoff: {}, beschreibung: "", preis: -1, fotos: [] }
}
class aufgabeSchneider {
    constructor(kleidungsStuecke, kurzBeschreibung, fotos) {
        this.kleidungsStuecke = kleidungsStuecke
        this.kurzBeschreibung = kurzBeschreibung
        this.fotos = fotos
    }
}
class kategorischeAufgabeSchneider {
    constructor(kurzBeschreibung, aufgaben, kleidungsStuecke, fotos) {
        this.kurzBeschreibung = kurzBeschreibung
        this.aufgaben = aufgaben
        this.kleidungsStuecke = kleidungsStuecke
        this.fotos = fotos
    }
}
class kleidungsStück {
    constructor(stoff, beschreibung, preis, fotos, marke) {
        this.stoff = stoff
        this.beschreibung = beschreibung
        this.preis = preis
        this.fotos = fotos
        this.marke = marke
    }
}
class userBewertung {
    constructor(id, userName, rating, kommentar, fotos, datum) {
        this.id = id
        this.userName = userName
        this.rating = rating
        this.fotos = fotos
        this.kommentar = kommentar
        this.datum = datum
    }
}
class adresse {
    constructor(strasse, hausnummer, postleitzahl, stadt, stadtteil) {
        this.strasse = strasse
        this.hausnummer = hausnummer
        this.postleitzahl = postleitzahl
        this.stadt = stadt
        this.stadtteil = this.stadtteil
    }
}
class bilder {
    constructor(logo, kleidungsStuecke, store, aufgaben,) {
        this.logo = logo
        this.kleidungsStuecke = kleidungsStuecke
        this.store = store
        this.aufgaben = aufgaben
    }
}
class infoStore {
    constructor(name, beschreibung, adresse, email, öffnungszeiten, eigentümer, telefon, website, marken) {
        this.name = name
        this.beschreibung = beschreibung
        this.adresse = adresse
        this.öffnungszeiten = öffnungszeiten
        this.eigentümer = eigentümer
        this.email = email
        this.telefon = telefon
        this.website = website
        this.marken = marken
    }
}
class öffnungsZeit {
    constructor(start, ende, nachVereinbarung) {
        this.start = start
        this.ende = ende
        this.nachVereinbarung = nachVereinbarung
    }
}
class öffnungszeiten {
    constructor(tage, geöffnet, zeitVerbleibend, zeiten,) {
        this.tage = tage
        this.zeiten = zeiten
        this.geöffnet = geöffnet
        this.zeitVerbleibend = zeitVerbleibend
    }
}
class storeObject {
    constructor(art, infoStore, bilder, serviceLeistungen, userBewertungen) {
        this.art = art
        this.infoStore = infoStore
        this.bilder = bilder
        this.serviceLeistungen = serviceLeistungen
        this.userBewertungen = userBewertungen
    }
}
function createÖffnungsZeiten(originalString, öffnungszeitenObjekt) {
    console.log("createöff" + originalString)
    const tageObject = {
        Montag: -1,
        Dienstag: -1,
        Mittwoch: -1,
        Donnerstag: -1,
        Freitag: -1,
        Samstag: -1,
        Sonntag: -1,
        anSchulferien: -1,
        anGesetzlFeiertagen: -1
    }
    const öffnungsZeitenTemp = []
    öffnungszeitenObjekt.tage = tageObject
    öffnungszeitenObjekt.zeiten = öffnungsZeitenTemp
    if (originalString == "24/7") {
        tageObject.Montag = 0
        tageObject.Dienstag = 0
        tageObject.Mittwoch = 0
        tageObject.Donnerstag = 0
        tageObject.Freitag = 0
        tageObject.Samstag = 0
        tageObject.Sonntag = 0
        öffnungsZeitenTemp.push("24/7")
        öffnungszeitenObjekt.zeitVerbleibend = "24/7"
        return
    }
    öffnungszeitenObjekt.zeitVerbleibend =
    {
        nextIndex: 0,
        tage: 0,
        minuten: 0,
        stunden: 0,
    }
    if (originalString.includes("Jan") || originalString.includes("Feb") || originalString.includes("Mar") ||
        originalString.includes("Apr") || originalString.includes("May") || originalString.includes("Jun") ||
        originalString.includes("Jul") || originalString.includes("Aug") || originalString.includes("Sep") ||
        originalString.includes("Oct") || originalString.includes("Nov") || originalString.includes("Dez")
    ) {
        return
        öffnungszeitenObjekt.zeitVerbleibend.besonderHeiten = true
        var oh = new opening_hours("01 Jan 2012");
        var is_open = oh.getState("01 Jan 2012");
       // console.log(is_open)
        alert(is_open)
    }
    originalString = originalString.split(" ")
   // console.log(typeof originalString + originalString)
    let newString = "-1"
    //fals irgendein Depp Mo, Fr oder Mo - Fr eingegeben hat
    for (let i = originalString.length - 1; i >= 0; i--) {
        //const sameType=newString!="-1"?(typeof JSON.parse(newString[0])==typeof JSON.parse([i][0])):false
       // console.log(originalString)
        
        const checkMinus = (originalString != "-1" && i >= 1) ? (originalString[i - 1][2] != "-" ? true : false) : false
        if (newString == "-1") {
            newString = `${originalString[i]}`
        }else {
            if((originalString[i])[originalString[i].length-1] == ","&&originalString[i][2]==":"&&newString[2]!=":"
            ){     
                    newString = `${originalString[i].substr(0,originalString[i].length-1)}` + "; " + `${newString}`
            }
            else  if ((newString[0] == ",") || (originalString[i] == ",")|| (originalString[i][originalString[i].length-1] == ",")|| originalString[i] == "-" || newString[0] == "-") {
            newString = `${originalString[i]}` + `${newString}`
             } 
            else { //falls irgendein depp Mo - Fr eingegeben hat
                newString = `${originalString[i]}` + " " + `${newString}`
            }
        }
    }
    originalString = new String(newString)
    console.log(originalString)
    const elements = originalString.split(";")
    const daysTemp = []
    for (let i0 = 0; i0 < elements.length; i0++) {
        let currentString = elements[i0]
       // console.log("current " + currentString)
        if (currentString.includes(" PH off")) {
           // console.log(currentString)
           // console.log("ph of" + currentString)
            tageObject.anGesetzlFeiertagen = "nicht geöffnet"
        } else if (currentString.includes(" SH off")) {
           // console.log("sh of" + currentString)
            tageObject.anSchulferien = "nicht geöffnet"
        }
        else {
           // console.log("elseeeeeeeeee")
            if (currentString.includes("SH") && currentString.includes("PH")) {
                tageObject.anSchulferien = []
                tageObject.anGesetzlFeiertagen = []
            }
            else if (currentString.includes("SH")) {
                tageObject.anSchulferien = []

            } else if (currentString.includes("PH")) {
                tageObject.anGesetzlFeiertagen = []
            } else {
                tageObject.anSchulferien = "keine Einschränkungen"
                tageObject.anGesetzlFeiertagen = "keine Einschränkungen"
            }
            //     currentString = currentString.filter(e => e) 
            currentString = currentString.split(" ")
            for (let i = 0; i < currentString.length; i++) {
                if(currentString[i]=="")break
                //// console.log("firstbreak " + i)
                //// console.log(firstBreak[i])
                const off = currentString[i].includes("off")
              // console.log(currentString[i])
                if (currentString[i].length > 2 || off) {
                    if (currentString[i].includes(":") == false && off == false) {
                        if ((currentString[i][2]) == "-" || (currentString[i][2]) == ",") { //range
                            let count = 1
                            let string1=currentString[i]
                            if (currentString[i].includes(",")) {
                               // console.log("split")
                                string1 = currentString[i].split(",")
                                count += currentString.length-1
                            }
                            const newRange = []
                            
                            for (let i2 = 0; i2 < count; i2++) {
                                const currentWord=count>1?string1[i2]:string1
                               // console.log(currentWord)
                                if ((currentWord[2]) == "-") {
                                    const dayStart = (currentWord[0] + currentWord[1])
                                    const dayEnd = (currentWord[3] + currentWord[4])
                                    // // console.log("daystart " + dayStart)
                                    for (let i3 = days[dayStart].index; i3 <= days[dayEnd].index; i3++) {
                                        newRange.push(tageArray[i3])
                                        if (tageObject[tageArray[i3]] == -[1]) {
                                            tageObject[tageArray[i3]] = []
                                        }
                                       // console.log(tageObject[tageArray[i3]])
                                    }
                                } else {
                                        let string2 = (currentWord[0] + currentWord[1])
                                        if (string2 != "PH" && string2 != "SH") {
                                            string2 = days[string2].name
                                            if (tageObject[string2] == -1 && off == false) {
                                                tageObject[string2] = []
                                            }
                                        } else {
                                            if (string2 == "PH") {
                                                string2 = "anGesetzlFeiertagen"
                                            }
                                            else if (string2 == "SH") {
                                                string2 = "anSchulferien"
                                            }
                                        }
                                        newRange.push(string2)
                                }
                            }
                            daysTemp.push(newRange)
                        }
                    } else { // datum
                       // console.log("DATUM")
                        let count = 1
                        let tempBreak = currentString[i]
                       // console.log(tempBreak)
                        if (tempBreak.includes(",")) {
                            tempBreak = tempBreak.split(",")
                            count = tempBreak.length
                           // console.log("split")
                        } else {
                            tempBreak = [tempBreak]
                        }
                       // console.log(tempBreak)
                        for (let i3 = 0; i3 < count; i3++) {
                            if (tempBreak[i3] == "") {
                                break
                            }
                            if (daysTemp.length == 0) {
                                let temp1 = new Array(7)
                                for (let i4 = 0; i4 < 7; i4++) {
                                    temp1[i4] = (tageArray[i4])
                                    tageObject[tageArray[i4]] = []
                                }
                                daysTemp.push(temp1)
                               // console.log("for all")
                            }
                            //// console.log(i3)
                           // console.log("newtime " + tempBreak + " " + i3)
                           // console.log(daysTemp)
                           // console.log(öffnungsZeitenTemp)
                           // console.log(tageObject)
                            const start = [JSON.parse(JSON.stringify(tempBreak[i3][0] + tempBreak[i3][1])), JSON.parse(JSON.stringify(tempBreak[i3][3] + tempBreak[i3][4]))]
                            const ende =  tempBreak[i3].length>5?[JSON.parse(JSON.stringify(tempBreak[i3][6] + tempBreak[i3][7])), JSON.parse(JSON.stringify(tempBreak[i3][9] + tempBreak[i3][10]))]:"open end"
                            const newTime = new öffnungsZeit(start, ende)
                            öffnungsZeitenTemp.push(newTime)
                            const öffnungszeitenIndex = (öffnungsZeitenTemp.length - 1)
                           // console.log("length " + öffnungszeitenIndex)
                            for (let i2 = 0; i2 < daysTemp[daysTemp.length - 1].length; i2++) {
                               // console.log(daysTemp[i2] + JSON.stringify(off))
                               // console.log("aaaaaa " + " " + daysTemp[daysTemp.length - 1][i2].day + " " + tageObject[daysTemp[daysTemp.length - 1][i2].day])
                                if (daysTemp[daysTemp.length - 1][i2] == "anGesetzlFeiertagen") {
                                    if (off == false) {
                                        tageObject.anGesetzlFeiertagen.push(öffnungszeitenIndex)
                                    }
                                    else {
                                        tageObject.anGesetzlFeiertagen = "nicht geöffnet"
                                    }
                                } else if (daysTemp[daysTemp.length - 1][i2] == "anSchulferien") {
                                    if (off == false) {
                                        tageObject.anSchulferien.push(öffnungszeitenIndex)
                                    }
                                    else {
                                        tageObject.anSchulferien = "nicht geöffnet"
                                    }
                                } else if (off == false) {
                                   // console.log("set öff " + daysTemp[daysTemp.length - 1][i2] + " " + tageObject[daysTemp[daysTemp.length - 1][i2]])
                                    tageObject[daysTemp[daysTemp.length - 1][i2]].push(öffnungszeitenIndex)
                                }
                                else {
                                   // console.log("close " + daysTemp[daysTemp.length - 1][i2])
                                    tageObject[daysTemp[daysTemp.length - 1][i2]] = -1
                                }
                                // daysTemp[daysTemp.length - 1][i2].oeffnungsZeiten.push(öffnungszeitenIndex)
                            }
                        }
                    }
                }
                else { //single day#
                    let newDay
                    if (currentString[i] != "") {
                        if (currentString[i] != "PH" && currentString[i] != "SH") {
                           // console.log(currentString[i])
                           // console.log(currentString[i + 1])
                            newDay = days[(currentString[i][0] + currentString[i][1])].name
                            if (tageObject[newDay] == -1 && off == false) {
                                tageObject[newDay] = []
                            }
                        } else {
                            newDay = (currentString[i][0] + currentString[i][1])
                        }
                        daysTemp.push(
                            [newDay]
                        )
                    }
                    //console.log("push single day " +firstBreak[i] +" > " + (firstBreak[i][0] + firstBreak[i][1])+ " " + tageObject[newDay] )
                    //console.log(days[(firstBreak[i][0] + firstBreak[i][1])])
                }
            }
        }
    }
    console.log(originalString)
    // console.log(tageObject)

    try {
        zeitVerbleibend(öffnungszeitenObjekt)
    } catch {
        console.warn(öffnungszeitenObjekt)
        console.warn("failed")
    }
    //console.log("öfftemp " + JSON.stringify(öffnungsZeitenTemp))
}
function zeitVerbleibend(öffnungszeitenObject) {
    console.log(öffnungszeitenObject)
    if (öffnungszeitenObject == "24/7") {
        return
    }
    console.log(öffnungszeitenObject)
    const now = new Date()
    // console.log(now)
    const datumJetzt = [now.getFullYear(), now.getMonth(), now.getDate()]
    //  console.log("datumJetzt" + datumJetzt)
    const tagJetzt = (now.toLocaleString('de', { weekday: 'long' }));
    if (öffnungszeitenObject.tage[tagJetzt] == -1) {
        console.log("geschlossen")
        öffnungszeitenObject.offen = false
    }
    let tempStart, tempEnd
    let nähesterIndex = -1
    let nähesteZeit = -1
    const jetzt = now.getTime()
    const zeiten = öffnungszeitenObject.tage[tagJetzt]
    // console.log(öffnungszeitenObject)
    //++++++++++++    nächste zeitspanne von heute    +++++++++++++++
    for (let i = 0; i < zeiten.length; i++) {
        const aktuelleZeitSpanne = öffnungszeitenObject.zeiten[zeiten[i]]
        console.log(aktuelleZeitSpanne)
        tempStart = new Date(datumJetzt[0], datumJetzt[1], datumJetzt[2], aktuelleZeitSpanne.start[0], aktuelleZeitSpanne.start[1])
        tempEnd = new Date(datumJetzt[0], datumJetzt[1], datumJetzt[2], aktuelleZeitSpanne.ende[0], aktuelleZeitSpanne.ende[1])
        if (jetzt < tempEnd && jetzt > tempStart) {
            öffnungszeitenObject.geöffnet = true
            const calcTemp = tempEnd - now
            const minuten = parseInt((calcTemp) / (60 * 1000))
            const stunden = parseInt(minuten / 60)
            öffnungszeitenObject.zeitVerbleibend.minuten = (minuten - stunden * 60) + 1
            öffnungszeitenObject.zeitVerbleibend.stunden = stunden
            öffnungszeitenObject.zeitVerbleibend.tage = 0
            //console.log("geöffnet ")
            //console.log(öffnungszeitenObject)
            return
        } else if (jetzt < tempStart) {
            const dif = (tempStart - now) / (60 * 1000)
            if (dif > nähesteZeit) {
                nähesterIndex = i
                nähesteZeit = dif
                console.log("next " + i)
            }
        }
        //  console.log(aktuelleZeitSpanne)
    }
    //++++++++++++     keine zeitspanne von heute gefunden    +++++++++++++++
    öffnungszeitenObject.geöffnet = false
    if (nähesteZeit == -1) {
        //++++++++++++     kein tag in dieser woche gefunden    +++++++++++++++
        let startIndex = tage[tagJetzt].index + 1 < 7 ? (tage[tagJetzt].index) : 0
        let tageCount = 0
        find(startIndex)
        function find(start) {
            for (let i = start; i < 7; i++) {
                //console.log(tageCount + tageArray[i])
                tageCount += 1
                if (öffnungszeitenObject.tage[tageArray[i]] != -1) {
                    const zeiten = öffnungszeitenObject.tage[tageArray[i]]
                    const aktuelleZeitSpanne = öffnungszeitenObject.zeiten[zeiten[0]]
                    tempStart = new Date(datumJetzt[0], datumJetzt[1], datumJetzt[2] + tageCount, aktuelleZeitSpanne.start[0], aktuelleZeitSpanne.start[1])
                    const calcTemp = tempStart - now
                    let minuten = parseInt((calcTemp) / (60 * 1000))
                    let stunden = parseInt(minuten / 60)
                    //let tage= minuten/24
                    öffnungszeitenObject.zeitVerbleibend.minuten = (minuten - stunden * 60) + 1
                    öffnungszeitenObject.zeitVerbleibend.stunden = stunden - ((tageCount - 1) * 24)
                    öffnungszeitenObject.zeitVerbleibend.tage = tageCount - 1
                    return;
                }
              
            }
            find(0)
        }
    } else {
        //++++++++++++    nächster tag in dieser woche    +++++++++++++++
        console.log(öffnungszeitenObject.tage)
        console.log(öffnungszeitenObject.zeiten)
        console.log(nähesteZeit + " " + nähesterIndex)
        const aktuelleZeitSpanne = öffnungszeitenObject.zeiten[zeiten[nähesterIndex]]
        //console.log(aktuelleZeitSpanne)
        tempStart = new Date(datumJetzt[0], datumJetzt[1], datumJetzt[2], aktuelleZeitSpanne.start[0], aktuelleZeitSpanne.start[1])
        const calcTemp = tempStart - now
        let minuten = parseInt((calcTemp) / (60 * 1000))
        let stunden = parseInt(minuten / 60)
        let tage=stunden/24
        öffnungszeitenObject.zeitVerbleibend.minuten = (minuten - stunden * 60) + 1
        öffnungszeitenObject.zeitVerbleibend.stunden = stunden -((tage) * 24)
        öffnungszeitenObject.zeitVerbleibend.tage = tage
        return
    }
}
function createStoreContext(tags, infostoreTemp, adresseTemp, öffnungsZeitenObject) {
    infostoreTemp.email = tags.email ? tags.email : "nicht angegeben"
    infostoreTemp.name = tags.name ? tags.name : "nicht angegeben"
    infostoreTemp.eigentümer = tags.eigentümer ? tags.eigentümer : "nicht angegeben"
    infostoreTemp.telefon = tags.phone ? tags.phone : "nicht angegeben"
    infostoreTemp.website = tags.website ? tags.website : "nicht angegeben"
    adresseTemp.hausnummer = tags["addr:housenumber"] ? tags["addr:housenumber"] : "nicht angegeben"
    adresseTemp.postleitzahl = tags["addr:postcode"] ? tags["addr:postcode"] : "nicht angegeben"
    adresseTemp.strasse = tags["addr:street"] ? tags["addr:street"] : "nicht angegeben"
    adresseTemp.stadt = tags["addr:city"] ? tags["addr:city"] : "nicht angegeben"
    adresseTemp.stadtteil = tags["addr:suburb"] ? tags["addr:suburb"] : "nicht angegeben"
    const öffnungszeitenRaw = tags["opening_hours"] ? tags["opening_hours"] : "nicht angegeben"
    if (öffnungszeitenRaw != "nicht angegeben") {
        createÖffnungsZeiten(öffnungszeitenRaw, öffnungsZeitenObject)
        infostoreTemp.öffnungszeiten = öffnungsZeitenObject
    } else {
        infostoreTemp.öffnungszeiten = öffnungszeitenRaw
    }

}
function randomProps(tags) {
    const rand = (x) => { return Math.ceil((Math.random() * x)) }
    const object = new storeObject()
    const bilderTemp = new bilder()
    object.bilder = bilderTemp
    const infoStoreTemp = new infoStore()
    const adresseTemp = new adresse()
    infoStoreTemp.adresse = adresseTemp
    const öffnungszeitenTemp = new öffnungszeiten()
    infoStoreTemp.öffnungszeiten = öffnungszeitenTemp
    object.infoStore = infoStoreTemp
    object.userBewertungen = []
    bilderTemp.kleidungsStuecke = []
    bilderTemp.store = []
    bilderTemp.aufgaben = []
    createStoreContext(tags, infoStoreTemp, adresseTemp, öffnungszeitenTemp)
    const imgs = [0, 1, 2]
    const temp6 = rand(4)
    for (let i3 = 0; i3 < temp6; i3++) {
        const temp = rand(temp6 - i3)
        imgs.splice(temp, 1)
    }
    for (let i3 = 0; i3 < imgs.length; i3++) {
        const tempImage = imageMap.get("store").images[i3]
        bilderTemp.store.push(tempImage)
    }
    function random() {
        if (Math.random() > 0.5) {
            object.art = "ÄnderungSchneiderei"
            infoStoreTemp.beschreibung = ("Beschreibung zu -" + tags.name + "- Ich bin eine ÄnderungsSchneiderei. ")

        } else {
            object.art = "Schneider"
            infoStoreTemp.beschreibung = ("Beschreibung zu -" + tags.name + "- Ich bin ein Schneider. ")
        }
    }
    if (tags.name == undefined) {
        random()
    }
    else if (tags.name.includes("Änderungs")) {
        object.art = "ÄnderungSchneiderei"
        infoStoreTemp.beschreibung = ("Beschreibung zu -" + tags.name + "- Ich bin eine ÄnderungsSchneiderei ")

    } else if (tags.name.includes("Schneider")) {
        object.art = "Schneider"
        infoStoreTemp.beschreibung = ("Beschreibung zu -" + tags.name + "- Ich bin ein Schneider")

    } else {
        random()
    }
    const labels = ["kürzen", "reißverschlussErsetzen", "lochFlicken", "wäscheLabel", "herstelung",]
    const tempObject = {}
    // +++++++++++++++++++ RANDOM AUFGABE +++++++++++++++++++
    const temp = rand(4)
    for (let i = 0; i < temp; i++) {
        const temp0 = rand(labels.length - 1)
        labels.splice(temp0, 1)
    }
    let hasverkauf = false
    if (tags.hasOwnProperty("brand")) {
        const marken = tags.brand.split(";")
        infoStoreTemp.marken = marken
        hasverkauf = true
        // console.log("brand")
    }
    for (let i = 0; i < labels.length; i++) {
        const temp2 = rand(labels.length - 1)
        let aufgabeTemp
        if (hasverkauf == false) {
            if (labels[temp2] == "wäscheLabel") {
                aufgabeTemp = new kategorischeAufgabeSchneider((labels[temp2] + " ist eine kategorische aufgabe mit unterAufgaben"), [], {}
                )
                if (Math.random() > 0.5) {
                    aufgabeTemp.aufgaben = "laserPrint"
                } else {
                    aufgabeTemp.aufgaben = "stickMuster"
                }
            }
            else {
                aufgabeTemp = new aufgabeSchneider({}, ("dies ist die beschreibung zu " + labels[temp2]), [])
            }
            tempObject[labels[temp2]] = aufgabeTemp
        } else {
            hasverkauf = false;
            aufgabeTemp = new aufgabeSchneider({}, "dieser shop hat auch marken im angebot", [])
            tempObject["verkauf"] = aufgabeTemp
        }
        const imgs = [0, 1, 2]
        const temp6 = rand(2)
        for (let i3 = 0; i3 < temp6; i3++) {
            const temp = rand(temp6 - i3)
            imgs.splice(temp, 1)
        }
        const imageIndices = new Array(imgs.length)
        for (let i3 = 0; i3 < imgs.length; i3++) {
            const tempImage = imageMap.get("aufgaben").images[i3]
            if (!bilderTemp.aufgaben.includes(tempImage)) {
                bilderTemp.aufgaben.push(tempImage)
                imageIndices[i3] = bilderTemp.aufgaben.length - 1
            } else {
                imageIndices[i3] = bilderTemp.aufgaben.indexOf(tempImage)
            }
        }
        aufgabeTemp.fotos = imageIndices
        // +++++++++++++++++++ RANDOM KLEIDUNGSSTÜCK +++++++++++++++++++
        const kleid = ["hose", "mantel", "jacke", "hut", "bluse", "hemd", "tShirt", "unterwäsche", "weste"]
        const temp4 = rand(8)
        for (let i4 = 0; i4 < temp4; i4++) {
            const temp8 = rand(8 - i4)
            kleid.splice(temp8, 1)
        }
        for (let i2 = 0; i2 < kleid.length; i2++) {
            const stoff = [
                "Leder",
                "KunstFaser",
                "Polyester",
                "Seide",
                "Pelz",
                "feinWäsche"
            ]
            const imgs = [0, 1, 2]
            const temp6 = rand(2)
            for (let i3 = 0; i3 < temp6; i3++) {
                const temp10 = rand(2 - i3)
                imgs.splice(temp10, 1)
            }
            const imageIndices = new Array(imgs.length)
            for (let i3 = 0; i3 < imgs.length; i3++) {
                const tempImage = imageMap.get(kleid[i2]).images[i3]
                if (!bilderTemp.kleidungsStuecke.includes(tempImage)) {
                    bilderTemp.kleidungsStuecke.push(tempImage)
                    imageIndices[i3] = bilderTemp.kleidungsStuecke.length - 1
                } else {
                    imageIndices[i3] = bilderTemp.kleidungsStuecke.indexOf(tempImage)
                }
            }
            const temp7 = rand(5)
            for (let i3 = 0; i3 < temp7; i3++) {
                const temp8 = rand(5 - i3)
                stoff.splice(temp8, 1)
            }
            const kleidungsStückTemp = new kleidungsStück
                (
                    stoff,
                    "dies ist die beschreibung zur stoffgruppe der aufgabe, hier können sachen geschrieben werden wie: bei seide können zusatzkosten entstehen",
                    Math.random() * 75,
                    imageIndices,
                    hasverkauf ? infoStoreTemp.marken[rand(infoStoreTemp.marken.length)] : "keine"
                )
            aufgabeTemp.kleidungsStuecke[kleid[i2]] = kleidungsStückTemp //value
        }
    }
    object.serviceLeistungen = tempObject
    return (object)
}
export function initializeMap(dispatch,userGPS) {
    const öffTemp = new öffnungszeiten()
    createÖffnungsZeiten("Su,Tu,Th 18:00-19:00, We 10:00-18:00, Fr 10:00-15:00; PH off", öffTemp)
    console.log(öffTemp)
    const tempSchneider = []
    const tempSchuh = []
    const tempSchlüssel = []
    //randomProps("json.elements[i].tags.name")
    let longest = 0
    if (schneider.elements.length > schlüssel.elements.length) {
        longest = schneider.elements.length
    } else {
        longest = schlüssel.elements.length
    }
    if (schuh.elements.length > longest) {
        longest = schuh.elements.length
    }
    console.log(longest)
    for (let i = 0; i < longest; i++) {
        const createGeoJSON = (json) => {
            return {
                "type": "Feature",
                "id": json.elements[i].id,
                "index": i,
                "details":  randomProps(json.elements[i].tags),
                "geometry": {
                    "type": "Point",
                    "coordinates": [json.elements[i].lon, json.elements[i].lat]
                }
            }
        }
        if (schneider.elements.length > i) {
            const temp = createGeoJSON(schneider)
            if (userGPS != undefined) {
                    temp.details.infoStore.entfernung = calcDistance(temp.geometry.coordinates[1], temp.geometry.coordinates[0], userGPS[0], userGPS[1])
                 //   console.log(temp.details.infoStore.entfernung)
                }
            tempSchneider.push(temp)
        }
        if (schuh.elements.length > i) {
            const temp = createGeoJSON(schuh)
            if (userGPS != undefined) {
                temp.details.infoStore.entfernung = calcDistance(temp.geometry.coordinates[1], temp.geometry.coordinates[0], userGPS[0], userGPS[1])
               // console.log(temp.details.infoStore.entfernung)
            }
            tempSchuh.push(temp)
        }
        if (schlüssel.elements.length > i) {
            const temp = createGeoJSON(schlüssel)
            if (userGPS != undefined) {
                temp.details.infoStore.entfernung = calcDistance(temp.geometry.coordinates[1], temp.geometry.coordinates[0], userGPS[0], userGPS[1])
               // console.log(temp.details.infoStore.entfernung)
            }
            tempSchlüssel.push(temp)
        }
    }
    console.log(tempSchneider)
    dispatch(setCurrentAreaNodes({ "schneider": tempSchneider, schlüssel: tempSchlüssel, schuh: tempSchuh }))
}
export function calcDistance(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d //* 1000; // meters
}
        