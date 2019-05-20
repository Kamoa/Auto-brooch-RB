module.exports = function autoBrooch(dispatch) {
	const SKILLS = require('./skills');
	const BROOCHES = [19705, 19706, 51011, 98405, 98404, 98406];
	const DELAY = 1000, MARGIN = 5000;

	let oCid = null,
		oJob = null,
		oX = null,
		oY = null,
		oZ = null,
		oW = null,
		itemBrooch = null,
		bCooldown = false;

	dispatch.hook('S_LOGIN', 10, (event) => {
		itemBrooch = null;
		bCooldown = false;
		oCid = event.gameId;
		oJob = (event.templateId - 10101) % 100;
	});

	dispatch.hook('C_PLAYER_LOCATION', 1, { order: -10 }, (event) => {
		oX = (event.x1 + event.x2) / 2;
		oY = (event.y1 + event.y2) / 2;
		oZ = (event.z1 + event.z2) / 2;
		oW = event.w;
	});

	dispatch.hook('S_INVEN', 5, { order: -10 }, (event) => {
		if (itemBrooch != null) return;

		for (i = 0; i < event.items.length; i++) {
			if (BROOCHES.includes(event.items[i].item)) {
				itemBrooch = event.items[i].item;
				break;
			}
		}
	});

	dispatch.hook('S_START_COOLTIME_ITEM', 1, (event) => {
		if (BROOCHES.includes(event.item)) {
			bCooldown = true;
			setTimeout(function () { bCooldown = false; }, event.cooldown * 1000);
		}
	});

	dispatch.hook('C_START_SKILL', 3, { order: -10 }, (event) => {
		let sId = Math.floor((event.skill - 0x4000000) / 10000);

		if (SKILLS[oJob] && SKILLS[oJob][sId]) {
			if (bCooldown) {
				setTimeout(function () { useItem(0); }, MARGIN);
			}
			else {
				useItem(DELAY);
			}
		}
	});

	function useItem(t) {
		if (bCooldown || itemBrooch === null) return;

		setTimeout(function () {
			dispatch.toServer('C_USE_ITEM', 1, {
				ownerId: oCid,
				item: itemBrooch,
				id: 0,
				unk1: 0,
				unk2: 0,
				unk3: 0,
				unk4: 1,
				unk5: 0,
				unk6: 0,
				unk7: 0,
				x: oX,
				y: oY,
				z: oZ,
				w: oW,
				unk8: 0,
				unk9: 0,
				unk10: 0,
				unk11: 1
			});
		}, t);
	}
}