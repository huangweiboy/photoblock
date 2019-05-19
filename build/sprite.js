const fs = require("fs");
const path = require("path");
const {
    JSDOM
} = require("jsdom");
require("colors");
const Spritesmith = require('spritesmith');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

const sprite = () => {
    let pack = {
        name: "photoblock",
        source: "build/11",
        dest: "src/packages/photoblock/components/emoji/11",
        size: 72
    };

    // Ensure dest and child folders exist
    mkDirByPathSync(pack.dest + '/img');

    const modifierCodes = ["1f3fb", "1f3fc", "1f3fd", "1f3fe", "1f3ff"];
    const blankCode = "2b1c";

    console.log(`\nGenerating ${pack.name} sprites\n`.inverse.yellow);

    let emojis = [];
    let maxItems = 0;
    let counter = 0;

    // Replace image dataURI's in file prior to processing otherwise out-of-memory errors occur 
    JSDOM.fromFile(`${pack.source}/unicode/emoji-list.html`, {})
        .then(dom => {
            const body = dom.window.document.body;
            const table = body.getElementsByTagName("table")[0];
            let category = "";
            let categoryKey = "";
            let categoryCount = -1;
            let maincount = 0;
            for (let row = 0; row < table.rows.length; row++) {
                if (table.rows[row].children.length > 0) {
                    let firstCell = table.rows[row].children[0];
                    if (firstCell.className == "bighead") {
                        category = firstCell.children[0].textContent;
                        console.log(`\n-- Found category ${category}\n`.yellow);
                        categoryKey = category.toLowerCase().replace(/[^a-z+]+/gi, '-');
                        if (categoryKey === 'component') { continue; }
                        emojis.push({
                            key: categoryKey.substr(0,4),
                            label: category,
                            items: [],
                            skin: false,
                            html: '',
                            css: ''
                        });
                        categoryCount++;
                        continue;
                    } else if (firstCell.className == "mediumhead") {
                        continue;
                    }
                    let code = table.rows[row].children[1].firstChild.textContent;
                    if (code === "Code") {
                        continue;
                    } else {
                        code = code.replace(/U\+/g, "").toLowerCase().replace(/ /g, "-");
                    }
                    let name = table.rows[row].children[3].textContent.replace('⊛ ','');
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                    let keywords = table.rows[row].children[4].textContent.split(" | ");
                    keywords.unshift(name.replace("flag: ", "").replace("Flag: ", ""));
                    let filePath = `${pack.source}/${pack.size}x${pack.size}/${code}.png`;

                    // Skip missing files and entries beginning with person because they are identical to man/woman chosen at random
                    if (fs.existsSync(filePath) && (name.indexOf('Person') !== 0)) {
                        emojis[categoryCount].items.push({
                            code: code,
                            name: name,
                           // keywords: Array.from(new Set(keywords)), // Make unique
                            skin: null
                        });
                        maincount++;
                    }
                }
            };
            // Component category does not belong ... has no emojis
            delete emojis['component'];

            for(let c=0;c<emojis.length;c++) {
                if (emojis[c].items.length > maxItems) {
                    maxItems = emojis[c].items.length;
                }    
            }

            console.log("Emojis: ", maincount, "Max: ", maxItems);
        })
        .then(() => {


            let modcount = 0;

            // Establish the pattern for injecting skin tone modifiers
            JSDOM.fromFile(`${pack.source}/unicode/emoji-modifiers.html`, {})
                .then(dom => {
                    const body = dom.window.document.body;
                    const table = body.getElementsByTagName("table")[0];
                    for (let row = 0; row < table.rows.length; row++) {
                        if ((table.rows[row].children.length > 1) && (table.rows[row].children[0].className === "rchars") && (table.rows[row].children[1].className === "code")) {
                            let mcode = table.rows[row].children[1].firstChild.textContent;
                            mcode = mcode.replace(/U\+/g, "").toLowerCase().replace(/ /g, "-");
                            if (mcode.indexOf(modifierCodes[0]) > -1) {
                                let pattern = mcode.split("-" + modifierCodes[0]).join("-X");
                                mcode = mcode.split("-" + modifierCodes[0]).join("");
                                for(let c=0;c<emojis.length;c++) {                                    
                                    let currEmojis = emojis[c].items;
                                    let filtered = currEmojis.filter(emoji => emoji.code === mcode);
                                    if (filtered.length > 0) {
                                        filtered[0].skin = pattern;
                                        emojis[c].skin = true;
                                        modcount++;
                                    }
                                }
                            }
                        }
                    };
                    // console.log(emojis);
                    console.log("Modifier Emojis: ", modcount);



                })
                .then(() => {

                    let containerClass = 'pbemoji';
                    let element = 'button';
                    let html = '';
                    let css = '';
                    for (let c=0;c<emojis.length;c++) {
 
                        let currEmojis = emojis[c].items;
                        let categoryKey = emojis[c].key;
                        let variants = [''];
                        if (emojis[c].skin === true) {
                            variants = variants.concat(modifierCodes);
                        } 
                        for(let v=0;v<variants.length;v++) {
                            
                            let variant = variants[v];
                            let spriteFiles = [];
                            let thisHtml = '';
                            let categoryName = categoryKey + (variant !== '' ? '-' + variant : '');
                            currEmojis.map((emoji, index) => {
                                let code = emoji.code;
                                if ((variant !== '') && (emoji.skin !== null)) {
                                    code = emoji.skin.replace('X', variant);
                                }
                                let filePath = `${pack.source}/${pack.size}x${pack.size}/${code}.png`;
                                spriteFiles.push(filePath);
                                thisHtml += `<${element} id="U-${code}" class="${containerClass}-sprite ${containerClass}-${categoryName} ${containerClass}-${index}" title="${emoji.name}"></${element}>`;
                            });

                            emojis[c].html += `<h3 id="photoblock-${categoryName}">${emojis[c].label}</h3><div>`;
                            emojis[c].html += thisHtml;
                            emojis[c].html += '</div>';
                            emojis[c].css += `\n.${containerClass}-${categoryName}{background-image: url('img/${categoryName}.png');}`;


                
                            // Pad images so each sprite has the same width
                            while(spriteFiles.length < maxItems) {
                                spriteFiles.push(`${pack.source}/${pack.size}x${pack.size}/${blankCode}.png`); // 
                            }

                            counter++;
                            // Generate our spritesheet
                            Spritesmith.run({
                                src: spriteFiles,
                                algorithm: 'left-right',
                                algorithmOpts: {sort: false} // Important. Without this sprite order is not in the order pushed to array
                            }, function handleResult(err, result) {
                                // If there was an error, throw it
                                if (err) {
                                    throw err;
                                }
                                fs.writeFileSync(pack.dest + '/img/' + categoryName + '.png', result.image);
                                console.log(`\n-- Creating sprite sheet ${categoryName}.png\n`.yellow);
                                counter--;
                                if (counter == 0) {          
                                    console.log('\n-- Starting compression of sprite sheets');                                   
                                    (async () => {
                                        let pngs = await imagemin([pack.dest + '/img/*.png'], pack.dest + '/img', {
                                            plugins: [
                                                imageminPngquant({quality: '65-80'})
                                            ]
                                        });
                                        console.log(`\nCompleted generating ${pack.name} sprites\n\n`.inverse.green);      
                                    })();
                                }

                            });
                        }
                    }

                          
                    html += `<html><head><link rel="stylesheet" href="../../${pack.dest}/photoblock-emoji.css"><link rel="stylesheet" href="shared.css"></head><body>`; 
                    html += '<div id="photoblock-emoji-wrapper"><div id="photoblock-emoji-tabs">';
                    // Tab navigation
                    for(let c=0;c<emojis.length;c++) {
                        html += `<a class="${containerClass}-sprite ${containerClass}-${emojis[c].key} ${containerClass}-0" href="#photoblock-${emojis[c].key}" title="${emojis[c].label}"></a> `;
                        if (emojis[c].skin) {
                            modifierCodes.map((code) => {
                                html += `<a class="${containerClass}-sprite ${containerClass}-${emojis[c].key}-${code} ${containerClass}-1" href="#photoblock-${emojis[c].key}-${code}" title="${emojis[c].label}"></a> `;
                            })
                        }
                    }
                    html += '</div>';
                    html += '<div id="photoblock-emoji-scroll">';
                    for (let c=0;c<emojis.length;c++) {
                        html += emojis[c].html;
                        css += emojis[c].css;
                        delete emojis[c].html;
                        delete emojis[c].css;
                    }
                    for(let m=0;m<maxItems;m++) {
                        css += `\n.${containerClass}-${m}{background-position: ${((100/(maxItems - 1)*m)).toFixed(4)}% 0;}`;
                    }

                        // Done with all sprites. Write to files.
                    html += '</div></div></body></html>';
                    fs.writeFileSync(pack.source + '/photoblock-emoji.html', html);
                    fs.writeFileSync(pack.dest + '/photoblock-emoji.css', `.${containerClass}-sprite{background-size:${ maxItems * 100}%;}` + css);
                    fs.writeFileSync(pack.source + '/shared.css', `
                        body{margin:0;padding:0;}
                        .photoblock-emoji-container{margin:0 auto;text-align:center;}
                        #photoblock-emoji-wrapper{overflow:hidden;overscroll-behavior:none;}
                        #photoblock-emoji-tabs{background-color:#ededed;margin-bottom:10px;border-bottom:2px solid #cccccc;text-align:center;padding-bottom:10px;}
                        a,button{background-color:transparent;margin:7px;border:0;padding:0;width:1.8rem;height:1.8rem;cursor:pointer;display:inline-block;}
                        #photoblock-emoji-scroll{height: 400px;overflow:auto;scroll-behavior: smooth;overscroll-behavior:contain;}
                    `);
                    fs.writeFileSync(pack.dest + '/photoblock-emoji.js', 'export default ' + JSON.stringify(emojis, null, '\t'));


                });

        })

        // https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync
        function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
            const sep = path.sep;
            const initDir = path.isAbsolute(targetDir) ? sep : '';
            const baseDir = isRelativeToScript ? __dirname : '.';
          
            return targetDir.split(sep).reduce((parentDir, childDir) => {
              const curDir = path.resolve(baseDir, parentDir, childDir);
              try {
                fs.mkdirSync(curDir);
              } catch (err) {
                if (err.code === 'EEXIST') { // curDir already exists!
                  return curDir;
                }
          
                // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
                if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                  throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
                }
          
                const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
                if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
                  throw err; // Throw if it's just the last created dir.
                }
              }
          
              return curDir;
            }, initDir);
          }

};

module.exports = sprite();