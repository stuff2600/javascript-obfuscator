import { inject, injectable, } from 'inversify';
import { ServiceIdentifiers } from '../../container/ServiceIdentifiers';

import { BinaryOperator } from 'estree';

import { TIdentifierNamesGeneratorFactory } from '../../types/container/generators/TIdentifierNamesGeneratorFactory';
import { TStatement } from '../../types/node/TStatement';

import { IOptions } from '../../interfaces/options/IOptions';
import { IRandomGenerator } from '../../interfaces/utils/IRandomGenerator';

import { initializable } from '../../decorators/Initializable';

import { AbstractCustomNode } from '../AbstractCustomNode';
import { Nodes } from '../../node/Nodes';
import { NodeUtils } from '../../node/NodeUtils';

@injectable()
export class BinaryExpressionFunctionNode extends AbstractCustomNode {
    /**
     * @type {BinaryOperator}
     */
    @initializable()
    private operator!: BinaryOperator;

    /**
     * @param {TIdentifierNamesGeneratorFactory} identifierNamesGeneratorFactory
     * @param {IRandomGenerator} randomGenerator
     * @param {IOptions} options
     */
    constructor (
        @inject(ServiceIdentifiers.Factory__IIdentifierNamesGenerator)
            identifierNamesGeneratorFactory: TIdentifierNamesGeneratorFactory,
        @inject(ServiceIdentifiers.IRandomGenerator) randomGenerator: IRandomGenerator,
        @inject(ServiceIdentifiers.IOptions) options: IOptions
    ) {
        super(identifierNamesGeneratorFactory, randomGenerator, options);
    }

    /**
     * @param {BinaryOperator} operator
     */
    public initialize (operator: BinaryOperator): void {
        this.operator = operator;
    }

    /**
     * @returns {TStatement[]}
     */
    protected getNodeStructure (): TStatement[] {
        const structure: TStatement = Nodes.getExpressionStatementNode(
            Nodes.getFunctionExpressionNode(
                [
                    Nodes.getIdentifierNode('x'),
                    Nodes.getIdentifierNode('y')
                ],
                Nodes.getBlockStatementNode([
                    Nodes.getReturnStatementNode(
                        Nodes.getBinaryExpressionNode(
                            this.operator,
                            Nodes.getIdentifierNode('x'),
                            Nodes.getIdentifierNode('y')
                        )
                    )
                ])
            )
        );

        NodeUtils.parentize(structure);

        return [structure];
    }
}
