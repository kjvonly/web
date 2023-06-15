<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script lang="ts">
	
	import { onMount } from 'svelte';
  let y = 0
	class Expression {
		addends: string[] = [];

		add(addend: string) {
			if (!addend) {
				return;
			}
			console.log('adding', addend);

			if (this.addends.length === 2) {
				this.addends = [];
			}

			if (addend) {
				this.addends.push(addend);
			}
		}

		clear() {
			this.addends = [];
		}

		toString(): string {
			if (this.addends.length === 0) {
				return '';
			}

			return this.addends.reduce((pv, cv, i, a) => {
				return pv + ' ' + cv;
			});
		}
	}

	$: selectedVerse = 0;

	let verses = [
		'[1] In the beginning God created the heaven and the earth.',
		'[2] And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
		'[3] And God said, Let there be light: and there was light.',
		'[4] And God saw the light, that it was good: and God divided the light from the darkness.',
		'[5] And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.',
		'[6] And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.',
		'[7] And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.',
		'[8] And God called the firmament Heaven. And the evening and the morning were the second day.',
		'[9] And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.',
		'[10] And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.',
		'[11] And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so.',
		'[12] And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good.',
		'[13] And the evening and the morning were the third day.',
		'[14] And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:',
		'[15] And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.',
		'[16] And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also.',
		'[17] And God set them in the firmament of the heaven to give light upon the earth,',
		'[18] And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good.',
		'[19] And the evening and the morning were the fourth day.',
		'[20] And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven.',
		'[21] And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good.',
		'[22] And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth.',
		'[23] And the evening and the morning were the fifth day.',
		'[24] And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so.',
		'[25] And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good.',
		'[26] And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.',
		'[27] So God created man in his own image, in the image of God created he him; male and female created he them.',
		'[28] And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth.',
		'[29] And God said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat.',
		'[30] And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so.',
		'[31] And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day. '
	];

	let doc: Document;
	let win: Window;
	let container: HTMLElement;
	function isScrolledIntoView(el: HTMLElement): boolean {
		var rect = el.getBoundingClientRect();
		var elemTop = rect.top;
		var elemBottom = rect.bottom;

		// Only completely visible elements return true:
		var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
		// Partially visible elements return true:
		//isVisible = elemTop < window.innerHeight && elemBottom >= 0;
		return isVisible;
	}

	function recursiveSearchDown(verse: number) {
		let first = doc.getElementById('v' + (verse - 1));
		let second = doc.getElementById('v' + verse);
		if (first === null || second === null) {
			console.log('null');
			return;
		}

		let fv = isScrolledIntoView(first);
		let sv = isScrolledIntoView(second);

		if (fv && !sv) {
			selectedVerse = verse - 1;
			first.scrollIntoView({ behavior: 'smooth' });
			return;
		}

		recursiveSearchDown(verse - 1);
	}

	function recursiveSearchUp(verse: number) {
		let first = doc.getElementById('v' + verse);
		let second = doc.getElementById('v' + (verse + 1));
		if (first === null || second === null) {
			console.log('null');
			return;
		}

		let fv = isScrolledIntoView(first);
		let sv = isScrolledIntoView(second);

		if (verse === 0 && fv) {
			return;
		}

		if (!fv && sv) {
			console.log('call recursive: fv !sv ', verse);
			selectedVerse = verse;

			let el = doc.getElementById("page")
      console.log("scroll height", el?.scrollHeight)
      if (el === null){
        console.log("el is null")
        return
      }
      
      let st = first.offsetTop - window.innerHeight + first.scrollHeight;
			console.log('scroll to: ', st, first.offsetTop, win.innerHeight, first.scrollHeight);
      console.log(st)
            

      console.log("page x y",el.scrollLeft, el.scrollTop)
      el.scrollTo(0, st)

      
      
			return;
		}

		recursiveSearchUp(verse + 1);
	}

	function pageDown() {
		recursiveSearchDown(verses.length - 1);
	}

	function pageUp() {
		recursiveSearchUp(0);
	}

	function navUp() {
		let sv = selectedVerse - 1;
		if (sv < 0) {
			selectedVerse = verses.length - 1;
		} else {
			selectedVerse = sv;
		}

		let el = doc.getElementById('v' + selectedVerse);

		if (el === null) {
			return;
		}

		if (!isScrolledIntoView(el)) {
			el?.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function navDown() {
		let sv = selectedVerse + 1;
		selectedVerse = sv % verses.length;
		let el = doc.getElementById('v' + selectedVerse);

		if (el === null) {
			return;
		}

		if (!isScrolledIntoView(el)) {
			el?.scrollIntoView({ behavior: 'smooth' });
		}
	}

	let map: Map<string, Function> = new Map<string, Function>();
	map.set('shift+P', navUp);
	map.set('shift+N', navDown);
	map.set('shift+V', pageDown);
	map.set('alt+v', pageUp);

	map.set('shift+ ', () => {
		console.log('selection mode');
	});

	let e = new Expression();
	onMount(() => {
		doc = document;
		win = window;
		document.addEventListener('keydown', function (event) {
			let cmd = '';

			if (event.ctrlKey) {
				cmd += 'ctl+';
			}

			if (event.altKey) {
				cmd += 'alt+';
			}

			if (event.shiftKey) {
				cmd += 'shift+';
			}

			if (
				(event.ctrlKey || event.altKey || event.shiftKey) &&
				event.key !== 'Control' &&
				event.key !== 'Alt' &&
				event.key !== 'Shift'
			) {
				if (event.key === 'Alt') {
					console.log('alt key');
				}
				console.log('key' + event.key);
				cmd += event.key;
				e.add(cmd);
			}

			let c = map.get(e.toString());

			if (c !== undefined) {
				console.log('executing ', e.toString());
				c();
				e.clear();
			}
		});
	});
  
</script>

<svelte:window bind:scrollY={y}/>
<div  class="container h-full mx-auto justify-start flex items-start" bind:this={container}>
	<div id="container" class="space-y-2 text-left flex flex-col items-left" >
		<p>{selectedVerse}</p>
		{#each verses as v, i}
			<p id="v{i}" class={i === selectedVerse ? 'bg-primary-300' : ''}>{v}</p>
		{/each}
	</div>
</div>

<style lang="postcss">
	h2 {
		font-family: 'KJV1611', Regular;
	}
	figure {
		@apply flex relative flex-col;
	}
	figure svg,
	.img-bg {
		@apply w-64 h-64 md:w-80 md:h-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite, glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>
