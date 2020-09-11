function findDeepestChildForPosition(parent, tree, position) {
	if (!tree.children || tree.children.length == 0) {
		return {
			parent: parent,
			child: tree,
		};
	}

	for (child of tree.children) {
		if (child.position.start.offset <= position && child.position.end.offset >= position) {
			return findDeepestChildForPosition(
				{
					parent: parent,
					node: tree,
				},
				child,
				position
			);
		}
	}
	return {
		parent: parent,
		child: tree,
	};
}

module.exports = findDeepestChildForPosition;