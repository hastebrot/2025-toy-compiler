import { type Tree } from "@lezer/common";
import { buildParser, buildParserFile } from "@lezer/generator";

function renderTree(tree: Tree) {
  let treeRepr = "";
  tree.iterate({
    enter(nodeRef) {
      const node = nodeRef.node;
      const isNamedTerm = /^\w/.test(node.name);
      treeRepr += isNamedTerm ? node.name : `"${node.name}"`;
      if (node.firstChild !== null) {
        treeRepr += "(";
      } else if (node.nextSibling !== null) {
        treeRepr += ",";
      }
    },
    leave(nodeRef) {
      const node = nodeRef.node;
      if (node.firstChild !== null) {
        treeRepr += ")";
        if (node.nextSibling !== null) {
          treeRepr += ",";
        }
      }
    },
  });
  return treeRepr;
}

if (import.meta.main) {
  const grammar = await Bun.file("./sources/json.grammar").text();
  const Parser = buildParser(grammar, { includeNames: true });
  const parserFile = buildParserFile(grammar, { includeNames: true });
  console.log(parserFile.parser);

  const input = "[1, 2, [3]]";
  const tree = Parser.parse(input);
  console.log(renderTree(tree));
}
