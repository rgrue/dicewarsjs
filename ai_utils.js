var WIN_PROB = null;

function win_probability(from_dice, to_dice) {
    if (!WIN_PROB) {
        function sum_dist(num_dice) {
            var dist = new Array(6 * num_dice + 1).fill(0);
            dist[0] = 1;
            for (var d = 0; d < num_dice; d++) {
                var next = new Array(dist.length).fill(0);
                for (var s = 0; s < dist.length; s++) {
                    if (dist[s] === 0) continue;
                    for (var face = 1; face <= 6; face++) next[s + face] += dist[s];
                }
                dist = next;
            }
            return dist;
        }
        WIN_PROB = [];
        for (var atk = 1; atk <= 8; atk++) {
            WIN_PROB[atk - 1] = [];
            var ad = sum_dist(atk), atk_total = Math.pow(6, atk);
            for (var def = 1; def <= 8; def++) {
                var dd = sum_dist(def), wins = 0;
                for (var a = 0; a < ad.length; a++) {
                    if (ad[a] === 0) continue;
                    for (var b = 0; b < a && b < dd.length; b++) wins += ad[a] * dd[b];
                }
                WIN_PROB[atk - 1][def - 1] = wins / (atk_total * Math.pow(6, def));
            }
        }
    }
    return WIN_PROB[from_dice - 1][to_dice - 1];
}

function get_valid_attacks(game, pn) {
    var attacks = [];
    for (var i = 1; i < game.AREA_MAX; i++) {
        if (game.adat[i].size == 0) continue;
        if (game.adat[i].arm != pn) continue;
        if (game.adat[i].dice <= 1) continue;
        for (var j = 1; j < game.AREA_MAX; j++) {
            if (game.adat[j].size == 0) continue;
            if (game.adat[j].arm == pn) continue;
            if (game.adat[i].join[j] == 0) continue;
            attacks.push({ from: i, to: j });
        }
    }
    return attacks;
}

function get_border_areas(game, pn) {
    var borders = [];
    for (var i = 1; i < game.AREA_MAX; i++) {
        if (game.adat[i].size == 0) continue;
        if (game.adat[i].arm != pn) continue;
        for (var j = 1; j < game.AREA_MAX; j++) {
            if (game.adat[j].size == 0) continue;
            if (game.adat[j].arm == pn) continue;
            if (game.adat[i].join[j] == 1) {
                borders.push(i);
                break;
            }
        }
    }
    return borders;
}

function get_internal_areas(game, pn) {
    var internals = [];
    for (var i = 1; i < game.AREA_MAX; i++) {
        if (game.adat[i].size == 0) continue;
        if (game.adat[i].arm != pn) continue;
        var has_enemy = false;
        for (var j = 1; j < game.AREA_MAX; j++) {
            if (game.adat[j].size == 0) continue;
            if (game.adat[j].arm == pn) continue;
            if (game.adat[i].join[j] == 1) {
                has_enemy = true;
                break;
            }
        }
        if (!has_enemy) internals.push(i);
    }
    return internals;
}

function get_connected_groups(game, pn) {
    var visited = {};
    var groups = [];
    for (var i = 1; i < game.AREA_MAX; i++) {
        if (game.adat[i].size == 0) continue;
        if (game.adat[i].arm != pn) continue;
        if (visited[i]) continue;
        var group = [];
        var queue = [i];
        visited[i] = true;
        while (queue.length > 0) {
            var cur = queue.shift();
            group.push(cur);
            for (var j = 1; j < game.AREA_MAX; j++) {
                if (visited[j]) continue;
                if (game.adat[j].size == 0) continue;
                if (game.adat[j].arm != pn) continue;
                if (game.adat[cur].join[j] == 1) {
                    visited[j] = true;
                    queue.push(j);
                }
            }
        }
        groups.push(group);
    }
    return groups;
}
