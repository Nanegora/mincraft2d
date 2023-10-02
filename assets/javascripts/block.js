
let materials = { };

function register_block(material, properties) {
    materials[material] = properties;
}

register_block('air', {
});

register_block('stone', {
    'resistance':7,
    'frequency':.03,
    'frequency_group':0.2,
    'pickaxe':1
});

register_block('grass', {
    'resistance':2,
    'shovel':1
});

register_block('deepslate', {
    'resistance':10,
    'frequency':.03,
    'frequency_group':0.2,
    'pickaxe':1
});

register_block('iron_ore', {
    'resistance':8,
    'frequency':.05,
    'frequency_group':0.04,
    'pickaxe':1
});

register_block('gold_ore', {
    'resistance':8,
    'frequency':.03,
    'frequency_group':0.04,
    'max_height':16,
    'pickaxe':1
});

register_block('diamond_ore', {
    'resistance':10,
    'frequency':.01,
    'frequency_group':0.1,
    'max_height':10,
    'pickaxe':1
});

register_block('coal_ore', {
    'resistance':8,
    'frequency':.03,
    'frequency_group':0.08,
    'pickaxe':1
});

register_block('oak_log', {
    'resistance':5,
    'frequency':.03,
    'frequency_group':0.2,
    'pickaxe':1
});

register_block('leaves', {
    'resistance':1,
    'axe':1
});

register_block('board', {
    'resistance':3,
    'axe':1
});

register_block('barrel', {
    'resistance':4,
    'axe':1,
    'container':9
});

register_block('barrel_renforced', {
    'resistance':8,
    'axe':1,
    'container':16
});

register_block('furnace', {
    'resistance':6,
    'pickaxe':1,
});