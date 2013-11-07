/**
 * Terrific JavaScript Framework v2.0.2
 * http://terrifically.org
 *
 * Copyright 2013, Remo Brunschwiler
 * @license MIT Licensed.
 *
 * Date: Tue, 30 Jul 2013 17:11:43 GMT
 *
 *
 * Includes:
 * Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 *
 * @module Tc
 *
 */
!function(){var root=this;var Tc;if(typeof exports!=="undefined"){Tc=exports}else{Tc=root.Tc={}}Tc.$=root.jQuery||root.Zepto||root.$;!function(){var initializing=false,fnTest=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){};Class.extend=function(prop){var _super=this.prototype;initializing=true;var prototype=new this;initializing=false;for(var name in prop){prototype[name]=typeof prop[name]=="function"&&typeof _super[name]=="function"&&fnTest.test(prop[name])?function(name,fn){return function(){var tmp=this._super;this._super=_super[name];var ret=fn.apply(this,arguments);this._super=tmp;return ret}}(name,prop[name]):prop[name]}function Class(){if(!initializing&&this.init){this.init.apply(this,arguments)}}Class.prototype=prototype;Class.constructor=Class;Class.extend=arguments.callee;return Class}}();Tc.Config={dependencies:{css:"/css/dependencies",js:"/js/dependencies"}};Tc.Application=Class.extend({init:function($ctx,config){this.config=$.extend({},Tc.Config,config);this.$ctx=$ctx||$("body");this.modules=[];this.connectors={};this.sandbox=new Tc.Sandbox(this,this.config)},registerModules:function($ctx){var self=this,modules=[],stringUtils=Tc.Utils.String;$ctx=$ctx||this.$ctx;$ctx.find('.mod:not([data-ignore="true"])').add($ctx).each(function(){var $this=$(this),classes=$this.attr("class")||"";classes=classes.split(" ");if(classes.length>1){var modName,skins=[],connectors=[],dataConnectors;for(var i=0,len=classes.length;i<len;i++){var part=$.trim(classes[i]);if(part){if(part.indexOf("-")>-1){part=stringUtils.toCamel(part)}if(part.indexOf("mod")===0&&part.length>3){modName=part.substr(3)}else if(part.indexOf("skin")===0){skins.push(part.substr(4).replace(modName,""))}}}dataConnectors=$this.attr("data-connectors");if(dataConnectors){connectors=dataConnectors.split(",");for(var i=0,len=connectors.length;i<len;i++){var connector=$.trim(connectors[i]);if(connector){connectors[i]=connector}}}if(modName&&Tc.Module[modName]){modules.push(self.registerModule($this,modName,skins,connectors))}}});return modules},unregisterModules:function(modules){var connectors=this.connectors;modules=modules||this.modules;if(modules===this.modules){this.connectors=[];this.modules=[]}else{for(var i=0,len=modules.length;i<len;i++){var module=modules[i],index;for(var connectorId in connectors){if(connectors.hasOwnProperty(connectorId)){connectors[connectorId].unregisterComponent(module)}}index=$.inArray(module,this.modules);if(index>-1){delete this.modules[index]}}}},start:function(modules){modules=modules||this.modules;for(var i=0,len=modules.length;i<len;i++){modules[i].start()}},stop:function(modules){modules=modules||this.modules;for(var i=0,len=modules.length;i<len;i++){modules[i].stop()}},registerModule:function($node,modName,skins,connectors){var modules=this.modules;modName=modName||undefined;skins=skins||[];connectors=connectors||[];if(modName&&Tc.Module[modName]){var id=modules.length;$node.data("terrific-id",id);modules[id]=new Tc.Module[modName]($node,this.sandbox,id);for(var i=0,len=skins.length;i<len;i++){var skinName=skins[i];if(Tc.Module[modName][skinName]){modules[id]=modules[id].getDecoratedModule(modName,skinName)}}for(var i=0,len=connectors.length;i<len;i++){this.registerConnection(connectors[i],modules[id])}return modules[id]}return null},registerConnection:function(connector,component){connector=$.trim(connector);var parts=connector.split("-"),connectorType,connectorId,identifier;if(parts.length===1){identifier=connectorId=parts[0]}else if(parts.length===2){connectorType=parts[0];connectorId=parts[1];identifier=connectorType+connectorId}if(identifier){var connectors=this.connectors;if(!connectors[identifier]){if(!connectorType){connectors[identifier]=new Tc.Connector(connectorId)}else if(Tc.Connector[connectorType]){connectors[identifier]=new Tc.Connector[connectorType](connectorId)}}if(connectors[identifier]){component.attachConnector(connectors[identifier]);connectors[identifier].registerComponent(component)}}},unregisterConnection:function(connectorId,component){var connector=this.connectors[connectorId];if(connector){connector.unregisterComponent(component);component.detachConnector(connector)}}});Tc.Sandbox=Class.extend({init:function(application,config){this.application=application;this.config=config;this.afterCallbacks=[]},addModules:function($ctx){var modules=[],application=this.application;if($ctx){modules=application.registerModules($ctx);application.start(modules)}return modules},removeModules:function(modules){var self=this,application=this.application;if(!$.isArray(modules)){var $ctx=modules;var tmpModules=[];$ctx.find(".mod").add($ctx).each(function(){var id=$(this).data("terrific-id");if(id!==undefined){module=self.getModuleById(id);if(module){tmpModules.push(module)}}});modules=tmpModules}if(modules){application.stop(modules);application.unregisterModules(modules)}},subscribe:function(connector,module){var application=this.application;if(module instanceof Tc.Module&&connector){connector=connector+"";application.registerConnection(connector,module)}},unsubscribe:function(connectorId,module){var application=this.application;if(module instanceof Tc.Module&&connectorId){connectorId=connectorId+"";application.unregisterConnection(connectorId,module)}},getModuleById:function(id){var application=this.application;if(application.modules[id]!==undefined){return application.modules[id]}else{throw new Error("the module with the id "+id+" does not exist")}},getConfig:function(){return this.config},getConfigParam:function(name){var config=this.config;if(config[name]!==undefined){return config[name]}else{throw new Error("the config param "+name+" does not exist")}},ready:function(callback){var afterCallbacks=this.afterCallbacks;afterCallbacks.push(callback);if(this.application.modules.length===afterCallbacks.length){for(var i=0;i<afterCallbacks.length;i++){var afterCallback=afterCallbacks[i];if(typeof afterCallback==="function"){delete afterCallbacks[i];afterCallback()}}}}});Tc.Module=Class.extend({init:function($ctx,sandbox,id){this.$ctx=$ctx;this.id=id;this.connectors={};this.sandbox=sandbox},start:function(){var self=this;if(this.on){this.on(function(){self.initAfter()})}},stop:function(){var $ctx=this.$ctx;$("*",$ctx).unbind().removeData();$ctx.unbind().removeData()},initAfter:function(){var self=this;this.sandbox.ready(function(){if(self.after){self.after()}})},fire:function(state,data,channels,defaultAction){var self=this,connectors=this.connectors,shouldBeCalled=true;if(channels==null&&defaultAction==null){if(typeof data==="function"){defaultAction=data;data=undefined}else if($.isArray(data)){channels=data;data=undefined}}else if(defaultAction==null){if(typeof channels==="function"){defaultAction=channels;channels=undefined}if($.isArray(data)){channels=data;data=undefined}}state=Tc.Utils.String.capitalize(state);data=data||{};channels=channels||Object.keys(connectors);for(var i=0,len=channels.length;i<len;i++){var connectorId=channels[i];if(connectors.hasOwnProperty(connectorId)){var connector=connectors[connectorId],proceed=connector.notify(self,"on"+state,data)||false;if(!proceed){shouldBeCalled=false}}else{throw new Error("the module #"+self.id+" is not connected to connector "+connectorId)}}if(shouldBeCalled){if(typeof defaultAction==="function"){defaultAction()}}},attachConnector:function(connector){this.connectors[connector.connectorId]=connector},detachConnector:function(connector){delete this.connectors[connector.connectorId]},getDecoratedModule:function(module,skin){if(Tc.Module[module][skin]){var Decorator=Tc.Module[module][skin];Decorator.prototype=this;Decorator.prototype.constructor=Tc.Module[module][skin];return new Decorator(this)}return null}});Tc.Connector=Class.extend({init:function(connectorId){this.connectorId=connectorId;this.components={}},registerComponent:function(component){this.components[component.id]={component:component}},unregisterComponent:function(component){var components=this.components;if(components[component.id]){delete components[component.id]}},notify:function(origin,state,data,callback){var proceed=true,components=this.components;for(var id in components){if(components.hasOwnProperty(id)){var component=components[id].component;if(component!==origin&&component[state]){if(component[state](data)===false){proceed=false}}}}return proceed}});Tc.Utils={};if(!Object.keys){Object.keys=function(obj){var keys=[],k;for(k in obj){if(Object.prototype.hasOwnProperty.call(obj,k)){keys.push(k)}}return keys}}Tc.Utils.String={capitalize:function(str){return str.substr(0,1).toUpperCase().concat(str.substr(1))},toCamel:function(str){return str.replace(/(\-[A-Za-z])/g,function($1){return $1.toUpperCase().replace("-","")})}}}.call(this);