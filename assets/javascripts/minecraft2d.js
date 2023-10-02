
console.log('test ');
let inventory = {
    0:{'material':'stone', 'count':1},
    1:{'material':'stone', 'count':1},
    2:{'material':'stone', 'count':1},
    3:{'material':'stone', 'count':1},
    4:{'material':'stone', 'count':1},
    5:{'material':'stone', 'count':1},
    6:{'material':'stone', 'count':1},
    7:{'material':'stone', 'count':1},
    8:{'material':'stone', 'count':1}
};
let selected_slot = 0;
let craft_table = {0:{}, 1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{}, 8:{}};

window.onload = function() {

    drawInventory();

    document.addEventListener("keyup", (event) => {
        if (event.isComposing || event.keyCode === 73) {
            toggleInventory();
        }
    });

    let altitudes = []
    let max_height = Math.ceil(2000 / 32);
    let initial_width = Math.ceil(4000 / 32);
    let blocks = document.getElementById("blocks");
    blocks.style.width = ''+initial_width * 32+'px';
    blocks.style.height = ''+max_height * 32+'px';
    let mountain_at = Math.random()*initial_width;

    for (let j = 0; j < initial_width; j++) {
        altitude = 40
        altitude += Math.ceil(Math.sin(j/8)*4);
        altitude += Math.ceil(Math.cos(j/12)*2);
        if ((mountain_at < j) && (j < mountain_at + 24))
            altitude += Math.ceil((Math.sin((j-mountain_at)/2))*6);
        altitudes.push(altitude)
    }

    for (let j = 0; j < initial_width; j++) {
        for (let i = 0; i < max_height; i++) {
            bk = document.createElement("div");
            bk.id = 'bk-'+i+'-'+j;
            bk.classList.add('bk');
            bk.classList.add(getMineral(i,j));
            blocks.appendChild(bk)
        }
    }
    trees = document.querySelectorAll('.bk-oak_log')
    for (let n = 0; n< trees.length; n++) {
        coord = trees[n].id.replace('bk-', '').split('-');
        i = parseInt(coord[0]);
        j = parseInt(coord[1]);
        setBkMaterial(i+1,j, 'oak_log')
        setBkMaterial(i+2,j, 'oak_log')
        setBkMaterial(i+3,j, 'oak_log')
        setBkMaterial(i+3,j, 'oak_log')
        setBkMaterial(i+4,j, 'leaves')
        setBkMaterial(i+4,j+1, 'leaves')
        setBkMaterial(i+4,j-1, 'leaves')
        setBkMaterial(i+3,j-1, 'leaves')
        setBkMaterial(i+2,j-1, 'leaves')
        setBkMaterial(i+3,j-2, 'leaves')
        setBkMaterial(i+2,j-2, 'leaves')
        setBkMaterial(i+3,j+1, 'leaves')
        setBkMaterial(i+2,j+1, 'leaves')
        setBkMaterial(i+3,j+2, 'leaves')
        setBkMaterial(i+2,j+2, 'leaves')
    }

    var mousedown = false;
    var mousedown_timer = '';
    var mousedown_block = '';
    blocks = document.querySelectorAll('.bk')
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (e.which === 1) {
                material = e.target.className.replace('bk bk-', '');
                mousedown_block = e.target.id;
                if (typeof materials[material].resistance != "undefined") {
                    mousedown = true;
                    e.target.classList.add('mousedown');
                    e.target.style.transitionDuration = (materials[material].resistance * 500).toString()+'ms'
                    mousedown_timer = setTimeout(function() {
                        if(mousedown && mousedown_block === e.target.id) {
                            breakBlock(e.target);
                        } else {
                            e.target.classList.remove('mousedown');
                        }
                    }, materials[material].resistance * 500);
                }
            }
        })
        blocks[i].addEventListener('contextmenu', (e) => {
            e.preventDefault();
            material = e.target.className.replace('bk bk-', '');

            if (material === "air") {
                if ((inventory[selected_slot].material != '') && (inventory[selected_slot].count > 0)) {

                    coord = getBkCoordonate(e.target.id);
                    setBkMaterial(coord.i, coord.j, inventory[selected_slot].material);
                    inventory[selected_slot].count = inventory[selected_slot].count - 1;
                    if (inventory[selected_slot].count === 0) {
                        inventory[selected_slot] = {}
                    }
                    drawInventory();
                }
            }
        })/*
        blocks[i].addEventListener('mouseup', (e) => {
            mousedown = false;
            e.target.classList.remove('mousedown');
            clearTimeout(mousedown_timer);
        })*/
    }
    document.getElementById('blocks').addEventListener('mouseup', (e) => {
        if (e.which === 1) {
            mousedown = false;
            if (document.querySelector('.mousedown')) {
                document.querySelector('.mousedown').style.transitionDuration = '0ms'
            }
            //e.target.classList.remove('mousedown');
            //clearTimeout(mousedown_timer);
        }
    })


    function breakBlock(bk) {
        console.log("break :"+bk.id);
        coord = getBkCoordonate(bk.id);
        material = getBkMaterial(coord.i,coord.j)
        bk.classList.remove('mousedown');
        bk.classList.remove('bk-' + material);
        bk.classList.add('bk-air');

        addToInventory(material);
        /*
        free_slot = getFreeSlot(material);
        if (free_slot !== false) {
            bk = document.querySelectorAll('#slot-'+free_slot+' .bk-'+material)
            if (bk.length === 0) {
                bk = document.createElement("div");
                bk.classList.add('bk');
                bk.classList.add('bk-' + material);
                document.getElementById('slot-' + free_slot).appendChild(bk)
                document.getElementById('slot-' + free_slot).classList.remove('free')
            }

            count = parseInt(document.querySelector('#slot-'+free_slot+ ' .count').innerHTML)
            if (isNaN(count))
                count = 0;
            count = count + 1
            document.querySelector('#slot-'+free_slot+ ' .count').innerHTML = count;
        }*/

        material_dessus = getBkMaterial(coord.i+1,coord.j);
        if (typeof materials[material_dessus].gravity != 'undefined' && materials[material_dessus].gravity) {
            setTimeout(function () {
                bk.classList.remove('bk-air');
                bk.classList.add('bk-'+material_dessus);
                id = 'bk-'+(coord.i+1)+'-'+coord.j;
                breakBlock(document.getElementById(id))
            }, 500);
        }
    }

    function addToInventory(material, nb = 1, slot_id = null) {
        if (slot_id === null) {
            slot_id = getFreeSlot(material)
        }
        if (slot_id !== false)
        {
            inventory[slot_id].material = material;
            if (isNaN(inventory[slot_id].count)) {
                inventory[slot_id].count = 0;
            }
            inventory[slot_id].count += nb;
        }
        drawInventory();
    }

    function saveInventory(destination = "#slot #slots") {
        slots = document.querySelectorAll(destination+">div");
        for (let n = 0 ; n < 9 ; n++) {
            bk = document.querySelector("#"+slots[n].id + ' .bk');
            material = null;
            count = 0;
            if(bk) {
                material = bk.className.replace('bk bk-', '');
                count = parseInt(document.querySelector(destination+" #"+slots[n].id+' .count').innerHTML);
                if (isNaN(count))  {
                    count = 0;
                }
            }
            if (bk && material && (count > 0)) {
                inventory[n] = {
                    'material':material,
                    'count':count
                }
            } else {
                inventory[n] = {};
            }
        }
    }

    function drawInventory(destination = "#slot #slots") {
        slots = document.querySelector(destination);
        slots.innerHTML = '';
        for (let i=0;i < 9 ; i++) {
            bk = document.createElement("div");
            bk.id="slot-"+i;
            if(i === selected_slot) {
                bk.classList.add('selected');
            }

            count = document.createElement('div');
            count.classList.add('count');
            if (inventory[i].hasOwnProperty('count')) {
                count.innerHTML = inventory[i].count;
            }
            bk.appendChild(count);

            if (inventory[i].hasOwnProperty('material')) {
                bk_material = document.createElement('div');
                bk_material.classList.add('bk');
                bk_material.classList.add('bk-' + inventory[i].material);
                bk.appendChild(bk_material);
            }

            if ("#slot #slots" === destination) {
                bk.addEventListener('click', function (e) {
                    e.preventDefault();
                    other_slots = document.querySelectorAll('#slot #slots>div')
                    for (let m = 0; m < other_slots.length; m++) {
                        other_slots[m].classList.remove('selected');
                    }
                    this.classList.add('selected');
                    selected_slot = parseInt(this.id.replace('slot-', ''));
                })
            }
            slots.appendChild(bk);
        }
    }

    function getMineral(i,j) {
        if (i==0) {
            return 'bk-deepslate';
        }

        if (i==3) {
            if (Math.random() <= .4)
                return 'bk-deepslate';
        }
        if (i==2) {
            if (Math.random() <= .6)
                return 'bk-deepslate';
        }
        if (i==1) {
            if (Math.random() <= .8)
                return 'bk-deepslate';
        }

        if (i<altitudes[j]) {
            if (Math.random() <= getMaterialFrequenty('coal_ore',i,j)) {
                return 'bk-coal_ore';
            }
            if (Math.random() <= getMaterialFrequenty('iron_ore', i,j)) {
                return 'bk-iron_ore';
            }
            if (Math.random() <= getMaterialFrequenty('gold_ore', i,j)) {
                return 'bk-gold_ore';
            }
            if (Math.random() <= getMaterialFrequenty('diamond_ore', i,j)) {
                return 'bk-diamond_ore';
            }

            return 'bk-stone';
        }
        if (i==altitudes[j])
            if (i<38)
                return 'bk-sand';
            else
                return 'bk-grass'
        if (i==altitudes[j]+1 && i> 38) {
            if (Math.random() <= getMaterialFrequenty('oak_log', i, j)) {
                return 'bk-oak_log';
            }
        }
        /*if ((i<34)&&(getBkMaterial(i-1, j) == 'oak_log')) {
            return 'bk-oak_log';
        }*/

        if (i<38) {
            return 'bk-water';
        }
            return 'bk-air';
    }

    function getMaterialFrequenty(material, i,j) {
        if((materials[material].max_height != 'undefined') && (i > materials[material].max_height)) {
            return 0;
        }
        if (j < 2 || i < 2) {
            return materials[material].frequency;
        }
        nb_material = 0;
        if ( getBkMaterial(i,j-2) == material) {nb_material++;}
        if ( getBkMaterial(i,j-1) == material) {nb_material++;}
        if ( getBkMaterial(i-1,j-2) == material) {nb_material++;}
        if ( getBkMaterial(i-1,j-1) == material) {nb_material++;}
        if ( getBkMaterial(i-1,j) == material) {nb_material++;}
        if ( getBkMaterial(i-2,j-2) == material) {nb_material++;}
        if ( getBkMaterial(i-2,j-1) == material) {nb_material++;}
        if ( getBkMaterial(i-2,j) == material) {nb_material++;}

        return materials[material].frequency + nb_material * materials[material].frequency_group;
    }

    function getBkCoordonate(id) {
        coord = id.replace('bk-', '').split('-');
        return {
            'i':parseInt(coord[0]),
            'j':parseInt(coord[1])
        };
    }

    function getBkMaterial(i, j) {
        id = 'bk-'+i+'-'+j;
        classes = document.getElementById(id).classList;
        for (let n = 0; n< classes.length; n++) {
            if (classes[n].startsWith('bk-')) {
                return classes[n].replace('bk-', '');
            }
        }
        return '';
    }
    function setBkMaterial(i, j, material) {
        id = 'bk-'+i+'-'+j;
        if (document.getElementById(id)) {
            document.getElementById(id).className = 'bk bk-' + material;
        }
    }

    function getFreeSlot(material) {
        for (let n=0;n < 9;n++) {
            if (inventory[n].hasOwnProperty('material') && (inventory[n].material === material)) {
                return n;
            }
        }
        for (let n=0;n < 9;n++) {
            if (!inventory[n].hasOwnProperty('material') || (inventory[n].material === null)) {
                return n;
            }
        }
        return false;
        /*
        slot = document.querySelector("#slot .bk-"+material)
        if (slot) {
            slot = slot.parentNode
            return parseInt(slot.id.replace('slot-', ''))
        }
        slot = document.querySelector("#slot .free")
        if (slot) {
            return parseInt(slot.id.replace('slot-', ''))
        }
        return false;*/
    }


    craft_slots = document.querySelectorAll('#craft>div');
    for (n = 0 ; n < craft_slots.length ; n++) {
        makeDropable(craft_slots[n]);
    }

    
    function toggleInventory() {
        if (document.getElementById('slot').classList.contains('d-none')) {
            saveInventory("#inventory-slots #slots");
        }
        drawInventory();
        drawInventory("#inventory-slots #slots");
        document.getElementById("inventory").classList.toggle('d-none');
        document.getElementById("slot").classList.toggle('d-none');

        bks = document.querySelectorAll('#inventory-slots .bk');
        for (n = 0 ; n < bks.length ; n++) {
            makeMovable(bks[n], 'inventory-slots')
        }
        bks = document.querySelectorAll('#inventory-slots>div>div');
        for (n = 0 ; n < bks.length ; n++) {
            bks[n].classList.remove('selected')
            makeDropable(bks[n])
        }
    }

    function makeMovable(bk) {
        bk.setAttribute("draggable", "true");
        bk.addEventListener('dragstart', function (event) {
            event.dataTransfer.dropEffect = "move";
            event.dataTransfer.setData("text/plain", this.parentNode.id);
        });
    }

    function makeDropable(bk) {
        bk.addEventListener('dragover', function (event ) {
            event.preventDefault();
            if (this.classList.contains('free')) {
                this.classList.add('selected');
            } else {
                slot_id = event.dataTransfer.getData("text/plain");
                material = document.querySelector('#inventory #'+slot_id+' .bk').className.replace('bk bk-', '')

                if (document.querySelector('#'+this.id+' .bk') && document.querySelector('#'+this.id+' .bk').classList.contains('bk-'+material)) {
                    this.classList.add('selected');
                }
            }
        })
        bk.addEventListener('dragleave', function (event ) {
            event.preventDefault();
            this.classList.remove('selected');
        })
        bk.addEventListener('drop', function (event ) {
            event.preventDefault();
            this.classList.remove('selected');
            slot_id = event.dataTransfer.getData("text/plain");
            material = document.querySelector('#inventory #'+slot_id+' .bk').className.replace('bk bk-', '')
            count =  parseInt(document.querySelector('#inventory #'+slot_id+' .count').innerHTML)

            document.querySelector('#inventory #'+slot_id).classList.add('free');
            document.querySelector('#inventory #'+slot_id+' .bk').remove();
            document.querySelector('#inventory #'+slot_id+' .count').innerHTML = '';
            document.querySelector('#inventory #'+this.id+' .count').innerHTML = count;
            bk = document.createElement("div");
            bk.classList.add('bk');
            bk.classList.add('bk-' + material);
            this.appendChild(bk)
            this.classList.remove('free')
            makeMovable(bk, 'craft')

            if (this.id.startsWith('craft')) {
                craft_slot = parseInt(this.id.replace('craft-', ''));
                craft_table[craft_slot] = {
                    'material': material,
                    'count':count,
                }
                recipes = searchAvailableRecipes();
                console.log(recipes)
            }
        })
    }

    function searchAvailableRecipes() {
        recipes = [];
        nb_material_to_craft = 0;
        for(m = 0; m < 9 ; m++) {
            if (typeof craft_table[m].material == "undefined") {
                craft_table[m].material = '';
            }
            if (craft_table[m].material != "") {
                nb_material_to_craft++;
                unique_material = craft_table[m].material;
            }
        }

        for(n = 0; n < crafts.length ; n++) {
            if (nb_material_to_craft != crafts[n].nb_required_material) {
                continue;
            }
            if (crafts[n].recipe.length === 1) {
                if (crafts[n].unique_material === unique_material) {
                    recipes.push(crafts[n]);
                }
            } else {
                recipe_is_correct = true;
                for(i = 0;i < 9 ; i++){
                    if (crafts[n].recipe_on_line[i] != craft_table[i].material) {
                        recipe_is_correct = false;
                        break;
                    }
                }
                if (recipe_is_correct) {
                    recipes.push(crafts[n]);
                }
            }
        }

        return recipes;
    }
}
