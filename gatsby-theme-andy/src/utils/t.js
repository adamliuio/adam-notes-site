
let filenames = [
	'about.md',
	'magic.md',
	'tmp/like.md',
	'tmp/sub/sub/sub-sub.md',
	'tmp/sub/sub.md',
	'tmp/sub/sub1/sub-sub.md',
	'western-culture.md'
]

// let uniqueFilenames = filenames.map((fn) => {
// 	let ns = fn.split("/");
// 	return ns[ns.length-1];
// })
// console.log(uniqueFilenames)
// console.log(filenames)

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

// usage example:
var a = ['a', 1, 'a', 2, '1'];
var unique = a.filter((value, index, self) => self.indexOf(value) === index); // returns ['a', 1, 2, '1']
console.log(unique)