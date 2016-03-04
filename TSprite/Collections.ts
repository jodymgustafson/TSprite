/// <reference path="Base.ts" />
module TSprite
{
    export module Collections
    {
        /** A simple sprite list */
        export class SpriteList<T extends Sprite>
        {
            private sprites = {};
            private _count = 0;

            public add(sprite: T): SpriteList<T>
            {
                this.sprites[sprite.uid] = sprite;
                this._count++;
                return this;
            }

            public remove(sprite: T): SpriteList<T>
            {
                delete this.sprites[sprite.uid];
                this._count--;
                return this;
            }

            public get count(): number
            {
                return this._count;
            }

            public empty(): SpriteList<T>
            {
                this.sprites = {};
                this._count = 0;
                return this;
            }

            public forEach(fn: (sprite: T) => any): void
            {
                for (var i in this.sprites)
                {
                    if (fn(this.sprites[i])) break;
                }

            }
        }

        export class DoublyLinkedListNode<T>
        {
            public next: DoublyLinkedListNode<T>;
            public prev: DoublyLinkedListNode<T>;
            public data: T;
            constructor(data: T, prev?: DoublyLinkedListNode<T>, next?: DoublyLinkedListNode<T>)
            {
                this.data = data;
                this.prev = prev;
                this.next = next;
            }
        }

        export class DoublyLinkedList<T>
        {
            /** @protected */
            _first: DoublyLinkedListNode<T>;
            /** @protected */
            _last: DoublyLinkedListNode<T>;
            private _count = 0;

            public get count(): number
            {
                return this._count;
            }

            public isEmpty(): boolean
            {
                return this._count === 0;
            }

            /** Gets the item at the index */
            public itemAt(index: number): T
            {
                var node = this._getNode(index);
                return (node ? node.data : null);
            }

            /** @protected */
            _getNode(index: number): DoublyLinkedListNode<T>
            {
                var node: DoublyLinkedListNode<T>;
                if (index >= 0 && index < this._count)
                {
                    node = this._first;
                    for (var i = 0; i < index; i++)
                    {
                        node = node.next;
                    }
                }
                return node;
            }

            /** Adds the item to the end of the list */
            public add(data: T)
            {
                var node = new DoublyLinkedListNode(data, this._last);
                if (this._count > 0)
                {
                    this._last.next = node;
                    this._last = node;
                }
                else
                {
                    this._first = this._last = node;
                }

                this._count++;
            }

            /** Inserts the item at the index */
            public insert(data: T, index: number)
            {
                var newNode = new DoublyLinkedListNode(data);
                if (this._count === 0)
                {
                    this._first = this._last = newNode;
                }
                else if (index === 0)
                {
                    this._first.prev = newNode;
                    newNode.next = this._first;
                    this._first = newNode;
                }
                else
                {
                    var node = this._getNode(index);
                    newNode.next = node;
                    newNode.prev = node.prev;
                    node.prev.next = newNode;
                    node.prev = newNode;
                    if (!newNode.next) this._last = newNode;
                }

                this._count++;
            }

            /** Removes the item at the index */
            public removeAt(index: number)
            {
                if (index >= 0 && index < this._count)
                {
                    if (index === 0)
                    {
                        this._first = this._first.next;
                        --this._count;
                    }
                    else
                    {
                        var node = this._getNode(index);
                        this._removeNode(node);
                    }
                }
            }

            /** @protected */
            _removeNode(node: DoublyLinkedListNode<T>)
            {
                if (node.prev)
                {
                    node.prev.next = node.next;
                }
                else
                {
                    // Must be first node
                    this._first = node.next;
                }

                if (node.next)
                {
                    node.next.prev = node.prev;
                }
                else
                {
                    // Must be last node
                    this._last = node.prev;
                }

                // Clear the node out to prevent memory leak
                node.next = node.prev = null;
                --this._count;
            }

            /** Truncates the list at the specified index */
            public truncate(index: number)
            {
                if (index >= 0 && index < this._count)
                {
                    if (index === 0)
                    {
                        this.clear();
                    }
                    else
                    {
                        var node = this._getNode(index);
                        node.prev.next = null;
                        if (!node.next) this._last = node.prev;
                        node.prev = null;
                        this._count = index;
                    }
                }
            }

            /** Removes all items from the list */
            public clear()
            {
                this._first = this._last = null;
                this._count = 0;
            }

            /** Enumerates over all items.
            * @param fn The function to call for each item. If it returns a truthy value the enumeration is stopped. 
            */
            public forEach(fn: (item: T) => any)
            {
                for (var item = this._first; item; item = item.next)
                {
                    if (fn(item.data)) break;
                }
            }
        }

        /**
         * Implements an ordered list of sprites sorted using a compare function
         */
        export class OrderedSpriteList<T extends TSprite.Sprite> extends DoublyLinkedList<T>
        {
            constructor(private compareFn: (sprite1: T, sprite2: T) => number)
            {
                super();
            }

            public add(sprite: T)
            {
                if (!this._first)
                {
                    // The list is empty
                    super.add(sprite);
                }
                else
                {
                    // Find the correct space to insert it
                    for (var node = this._first, i = 0; node; node = node.next, i++)
                    {
                        if (this.compareFn(sprite, node.data) > 0)
                        {
                            super.insert(sprite, i);
                            return;
                        }
                    };
                    // If we made it this far it should be appended
                    super.add(sprite);
                }
            }

            public purgeInactive()
            {
                for (var node = this._first; node; node = node.next)
                {
                    if (!node.data.active)
                    {
                        super._removeNode(node);
                    }
                }
            }

            public removeSprite(sprite: TSprite.Sprite)
            {
                for (var node = this._first; node; node = node.next)
                {
                    if (sprite === node.data)
                    {
                        super._removeNode(node);
                        return;
                    }
                }
            }

            public toString(max?: number)
            {
                max = max || 100;
                var cnt = 0, sb = [];
                this.forEach((sprite) =>
                {
                    sb.push(sprite.id);
                    return (++cnt > max);
                });
                return sb.join(",");
            }
        }

        /** Implements a sprite list ordered by zIndex */
        export class ZOrderedSpriteList<T extends TSprite.Sprite> extends OrderedSpriteList<T>
        {
            constructor()
            {
                super((s1, s2) => s1.zIndex - s2.zIndex);
            }
        }
    }
} 