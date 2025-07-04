import createGraph from 'ngraph.graph';
import path from 'ngraph.path';

class PathFinder {
    private graph: any;
    private finder: any;

    constructor(pairs: any[]) {
        this.graph = createGraph();

        pairs.forEach((pair) => {
            this.graph.addNode(pair.token0.address);
            this.graph.addNode(pair.token1.address);
            this.graph.addLink(pair.token0.address, pair.token1.address, pair.fee);
            this.graph.addLink(pair.token1.address, pair.token0.address, pair.fee);
        });

        this.finder = path.aStar(this.graph);
    }

    findPath(fromToken: string, toToken: string) {
        return this.finder.find(fromToken, toToken).reduce((acc: any[], node: any, i: number, orig: any[]) => {
            if (acc.length > 0) {
                acc.push(this.graph.getLink(orig[i - 1].id, node.id).data);
            }

            acc.push(node.id);

            return acc;
        }, []).reverse();
    }
}

export default PathFinder;