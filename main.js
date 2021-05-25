/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import FileUtilities from "../FileUtilities/main";


const FP = "./config/ChatTriggers/modules/CakeFinder/"
const TPFP = "./resourcepacks/CakeFinder/";
const TPFP2 = TPFP + "assets/minecraft/mcpatcher/cit/"
let cakes = String(FileLib.read(FP + "cakes.txt")).split(" ");
const version = "1.1.0";
const ChatStart = "&3[&d&lCakeFinder&3]&r ";
const ChatLine = "&3&m-----------------------------------------------------";
const ChatLineName = "&3&m---------------------&r &d&lCakeFinder&r &3&m--------------------";
const help1 = new Message("                                                  ", new TextComponent("&dNext Page =>").setClick("run_command", "/cakefinder help2"));
const help2 = new Message("           ", new TextComponent("&d<= Last Page").setClick("run_command", "/cakefinder help1"), "                       " ,new TextComponent("&dNext Page =>").setClick("run_command", "/cakefinder help3"));
const help3 = new Message("           ", new TextComponent("&d<= Last Page").setClick("run_command", "/cakefinder help2"), "                       " ,new TextComponent("&dNext Page =>").setClick("run_command", "/cakefinder help4"));
const help4 = new Message("           ", new TextComponent("&d<= Last Page").setClick("run_command", "/cakefinder help3"));
const updateMSG = ChatStart + "&eCakeFinder has updated to " + version + ". &6Changelog: &eWhen a new cake is released a chat message appears with the option to add it to your list.";

function updateAlert() {
    if (!FileUtilities.exists(FP + "version.txt") || !FileUtilities.exists(TPFP + "pack.png")) {
        FileUtilities.copyFile(FP + "cake_needed_default.png", FP + "cake_needed.png", true);
        FileUtilities.newDirectory(TPFP2);
        FileLib.write(FP + "version.txt", version);
        ChatLib.chat(updateMSG);
        setTimeout(() => {
            FileUtilities.copyFile(FP + "pack.mcmeta", TPFP + "pack.mcmeta", true);
            FileUtilities.copyFile(FP + "pack.png", TPFP + "pack.png", true);
        }, 2000);
    } else if (FileLib.read(FP + "version.txt") !== version) {
        FileLib.write(FP + "version.txt", version);
        ChatLib.chat(updateMSG);
    }
}

updateAlert();

register("step", () => {
    cakeAlert();
}).setDelay(600);

register("chat", () => {
    cakeAlert();
}).setCriteria("Go there and talk to the Baker to get your New Year's Cake!");

function cakeAlert() {
    const lastYear = Number(FileLib.read(FP + "year.txt"));
    const year = sbYear();
    if (year - lastYear === 0) return;
    const years  = year - lastYear;
    const tcs = [ChatStart + "&eThese new cakes have been baked whilst you were gone. Click the years you want added to your list:"];
    let i = 0;
    while (i < years) {
        let m = lastYear + i;
        let punc;
        if (i === years) {
            punc = "&e.";
        } else {
            punc = "&e,";
        }
        tcs.push(new TextComponent(" &6" + m + punc).setClick("run_command", "/cakefinder add " + m).setHoverValue("&eClick this year to add it to your cake list."));
        i++;
    }
    const cakeMSG = new Message(tcs);
    print(cakeMSG);
    ChatLib.chat(cakeMSG);
    FileLib.write(FP + "year.txt", year);
}

register("command", (arg1, ...args) => {

    if (arg1 === "add") {
        args.forEach(cake => {
            if (!isNaN(Number(cake)) && ((Number(cake) >= 0) && (Number(cake) < sbYear()))) {
                cakes.push(cake);
            }
        });
        cakes = [...new Set(cakes)];
        cakes.sort((a, b) => a-b);
        ChatLib.chat(ChatStart + "&eThe following cakes are highlighted: &6" + cakes.join("&e, &6"));
        ChatLib.chat(ChatStart + "&eThe changes will occur once the pack has been reloaded.");

    } else if (arg1 === "remove") {
        args.forEach(arg => {
            if (cakes.includes(arg)) {
                cakes.splice((cakes.indexOf(arg)), 1);
            }
        });
        ChatLib.chat(ChatStart + "&eThe following cakes are highlighted: &6" + cakes.join("&e, &6"));
        ChatLib.chat(ChatStart + "&eThe changes will occur once the pack has been reloaded.");
        cakes = [...new Set(cakes)];
        cakes.sort((a, b) => a-b);

    } else if (arg1 === "clear") {
        cakes = [];
        ChatLib.chat(ChatStart + "&eNo cakes are highlighted.");
        ChatLib.chat(ChatStart + "&eThe changes will occur once the pack has been reloaded.");

    } else if (arg1 === "list") {
        ChatLib.chat(ChatStart + "&eThe following cakes are highlighted: &6" + cakes.join("&e, &6")); 
    
    } else if (arg1 === "help1") {
        ChatLib.chat(ChatLineName);
        ChatLib.chat(ChatStart + "&6/cakefinder add [numbers]&e is used to add to the list. Any invalid numbers will be ignored, including cakes that do not yet exist.");
        ChatLib.chat(ChatStart + "&6/cakefinder remove [numbers]&e is used to remove years from the list.");
        ChatLib.chat(ChatStart + "&6/cakefinder clear&e is used to empty the list.");
        ChatLib.chat(ChatStart + "&6/cakefinder list&e is used to show the list.");
        ChatLib.chat(ChatStart + "&6/cakefinder&e or any invalid arrgument will show this guide.");
        ChatLib.chat(help1);
        ChatLib.chat(ChatLine);

    } else if (arg1 === "help2") {
        ChatLib.chat(ChatLineName);
        ChatLib.chat(ChatStart + "&eThe CakeFinder ct module retextures cakes based off a list you can add and remove years from.");
        ChatLib.chat(ChatStart + "&eTo change the highlighted cake texture, run &6/ct files&e and edit &6modules/CakeFinder/cake_needed.png&e.")
        ChatLib.chat(help2);
        ChatLib.chat(ChatLine);

    } else if (arg1 === "help3") {
        ChatLib.chat(ChatLineName);
        ChatLib.chat(ChatStart + "&eIt uses a texture pack (requiring OptiFine), which is automatically created, but you will need to enable the pack as normal and at higher priority to other packs affecting cakes.");
        ChatLib.chat(new Message(ChatStart, "&eIf you have any issues join the SkyblockCommands discord server at  ", new TextComponent("&6&ndiscord.gg/zyuMB7T").setClick("open_url", "https://discord.gg/zyuMB7T")));
        ChatLib.chat(help3);
        ChatLib.chat(ChatLine);

    } else if (arg1 === "help4") {
        ChatLib.chat(ChatLineName);
        ChatLib.chat(ChatStart + "&eChanges you have made to the list will only appear ingame once the pack has been reloaded. You can do this with F3+t, going into the resource pack menu or restarting your client");
        ChatLib.chat(help4);
        ChatLib.chat(ChatLine);

    } else {
        ChatLib.command("cakefinder help1", true);
    }
    
    FileLib.write(FP + "cakes.txt", cakes.join(" "));
    FileLib.write(FP + "cake_needed.properties", "type=item\nitems=minecraft:cake\nnbt.display.Name=ipattern:*new year cake*\nnbt.display.Lore.*=iregex:.*the (" + cakes.join("|") + ")(st|nd|rd|th).*");

    FileUtilities.copyFile(FP + "cake_needed.properties", TPFP2 + "cake_needed.properties", true);
    FileUtilities.copyFile(FP + "cake_needed.png", TPFP2 + "cake_needed.png", true);

}).setName("cakefinder");

const year1 = 1560718500000;
const sbYearTime = 446400000;

function sbYear() {
    const time = new Date().getTime();
    const years = time - year1;
    return ((years - (years % sbYearTime)) / sbYearTime) + 2;
}

function nextYear() {
    const year = sbYear();
    return year1 + (sbYearTime * (year - 1));
}