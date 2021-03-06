/**
 * UB RIA Base
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 详情页Model基类
 * @exports mvc.DetailModel
 * @author otakustay
 */
define(
    function (require) {
        var u = require('../util');

        /**
         * @class mvc.DetailModel
         * @extends mvc.SingleEntityModel
         */
        var exports = {};

        /**
         * 设置globalData方法
         *
         * @public
         * @method mvc.DetailModel#setGlobalData
         * @param {Object} data 全局数据对象
         */
        exports.setGlobalData = function (data) {
            this.addData('global', data);
        };

        /**
         * 获取列表子Action的URL
         *
         * @protected
         * @method mvc.DetailModel#getListActionURL
         * @return {string}
         */
        exports.getListActionURL = function () {
            var query = this.get('url').getQuery();
            // 所有列表参数都拥有`list.`前缀
            var args = {};
            u.each(
                query,
                function (value, key) {
                    if (key.indexOf('list.') === 0) {
                        args[key.substring(5)] = value;
                    }
                }
            );
            if (query.id) {
                // 原`id`字段用于详情页，传递给列表页要变为`xxxIds`的查询条件
                args[this.entityName + 'Id'] = query.id;
            }
            var URL = require('er/URL');
            var actionURL =
                URL.withQuery('/' + this.getListActionName() + '/list', args);
            return actionURL + '';
        };

        /**
         * 获取列表子Action的实体名称
         *
         * @protected
         * @method mvc.DetailModel#getListActionName
         * @return {string}
         */
        exports.getListActionName = function () {
            return this.entityName;
        };

        /**
         * 获取当前详情页对应树节点的的实体名称
         *
         * 默认使用`entityName`，但并不一定会相同，通过重写此方法覆盖
         *
         * @protected
         * @method mvc.DetailModel#getTreeNodeEntityName
         * @return {string}
         */
        exports.getTreeNodeEntityName = function () {
            return this.entityName;
        };

        /**
         * 设置列表子Action的URL
         */
        function setListActionURL() {
            var url = this.getListActionURL();
            this.set('listActionURL', url);
        }

        /**
         * @override
         */
        exports.load = function () {
            var loading = this.$super(arguments);
            return loading.then(u.bind(setListActionURL, this));
        };

        var SingleEntityModel = require('./SingleEntityModel');
        var DetailModel = require('eoo').create(SingleEntityModel, exports);

        return DetailModel;
    }
);
