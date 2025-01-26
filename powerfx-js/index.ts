import { type Tree } from "@lezer/common";
import { buildParser, buildParserFile } from "@lezer/generator";

function renderTree(tree: Tree) {
  let items = "";
  let level = 0;
  tree.iterate({
    enter(node) {
      const indent = "".padEnd(level);
      items += `${indent}- ${node.type.name} (${node.from} → ${node.to})\n`;
      level += 1;
    },
    leave() {
      level -= 1;
    },
  });
  return items;
}

if (import.meta.main) {
  const grammar = await Bun.file("./sources/json.grammar").text();
  const Parser = buildParser(grammar);
  const parser = buildParserFile(grammar).parser;
  console.log(parser);

  const input = "[1, 2, [3]]";
  const tree = Parser.parse(input);
  console.log(renderTree(tree));
}
