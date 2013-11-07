define(function(){return { views:{ "default":function anonymous(it) {
var out='';if(it.sections['header']){out+=' ';var arr1=it.sections['header'];if(arr1){var value,i1=-1,l1=arr1.length-1;while(i1<l1){value=arr1[i1+=1];out+=' '+( it.t.module(value) )+' ';} } }if(it.sections['workspace']){out+=' ';var arr2=it.sections['workspace'];if(arr2){var value,i2=-1,l2=arr2.length-1;while(i2<l2){value=arr2[i2+=1];out+=' '+( it.t.module(value) )+' ';} } }return out;
},
    editor:function anonymous(it) {
var out='';if(it.sections['header']){out+=' ';var arr1=it.sections['header'];if(arr1){var value,i1=-1,l1=arr1.length-1;while(i1<l1){value=arr1[i1+=1];out+=' '+( it.t.module(value) )+' ';} } }if(it.sections['workspace']){out+=' ';var arr2=it.sections['workspace'];if(arr2){var value,i2=-1,l2=arr2.length-1;while(i2<l2){value=arr2[i2+=1];out+=' '+( it.t.module(value) )+' ';} } }return out;
} },
  modules:{ Default:{ "default":function anonymous(it) {
var out='Default';return out;
} },
    Editor:{ editor:function anonymous(it) {
var out='<div class="mod mod-editor"> <div class="row-fluid"> <div class="span4"> <div class="code-box"> <header> <div class="settings"> </div> </header> <code class="html"></code> </div> </div> <div class="span4"> <div class="code-box"> <header> <div class="settings"> <h3>Precompilers</h3> <ul class="precompilers"> <li><a href="#text/css">None</a></li> <li><a href="#text/x-less">Less</a></li> </ul> </div> </header> <code class="css"></code> </div> </div> <div class="span4"> <div class="code-box"> <header> <div class="settings"> </div> </header> <code class="js"></code> </div> </div> </div> <div class="row-fluid"> <iframe sandbox="allow-scripts allow-same-origin allow-pointer-lock" allowtransparency="true" frameborder="0" scrolling="no"></iframe> </div></div>';return out;
} },
    ModuleBrowser:{ "module-browser-list":function anonymous(it) {
var out='';var arr1=it.modules;if(arr1){var module,i1=-1,l1=arr1.length-1;while(i1<l1){module=arr1[i1+=1];out+='<li class="span4"><div class="thumbnail"><div class="iframe-wrap"><a class="cover" href="#edit/'+( module._id )+'"></a><iframe src="/api/modules/render/'+( module._id )+'" allowtransparency="true" frameborder="0"scrolling="no"/><div class="meta-overlay"><h2>'+( module.name )+'</h2></div></div><div class="meta"><div class="user"><a href="#user/'+( module.user._id )+'">'+( module.user._id )+'</a></div><ul class="stats"><li class="views">'+( module.meta.views )+' <i class="icon-views"></i></li><li class="favs">'+( module.meta.favs )+' <i class="icon-favs"></i></li></ul></div></div></li>';} } return out;
},
      "module-browser":function anonymous(it) {
var out='<div class="mod mod-module-browser"><ul class="modules thumbnails"></ul></div>';return out;
} },
    Navigation:{ "navigation-editor-resources":function anonymous(it) {
var out='<div class="mod mod-navigation"><nav class="navbar"><div class="navbar-inner"><a class="brand" href="#">terrific.io</a><ul class="nav"><li class="active"><a href="#browse">Browse</a></li><li><a href="#search">Search</a></li></ul><div class="pull-right"><a class="btn btn-info b-back" href="javascript:;"><i class="icon-circle-arrow-left icon-white"></i>Back to Editor</a><a class="btn btn-primary b-resource" href="javascript:;"><i class="icon-upload icon-white"></i> AddResource</a></div></div></nav></div>';return out;
},
      "navigation-editor":function anonymous(it) {
var out='<div class="mod mod-navigation"><nav class="navbar"><div class="navbar-inner"><a class="brand" href="#">terrific.io</a><ul class="nav"><li class="active"><a href="#browse">Browse</a></li><li><a href="#search">Search</a></li></ul><div class="pull-right"><a class="btn btn-info b-resources" href="#add"><i class="icon-upload icon-white"></i> Resources</a><a class="btn btn-primary b-save" href="#save"><i class="icon-refresh icon-white"></i> Save</a></div></div></nav></div>';return out;
},
      navigation:function anonymous(it) {
var out='<div class="mod mod-navigation"><nav class="navbar"><div class="navbar-inner"><a class="brand" href="#">terrific.io</a><ul class="nav"><li class="active"><a href="#browse">Browse</a></li><li><a href="#search">Search</a></li></ul><div class="pull-right"><a class="btn btn-primary b-create" href="#create"><i class="icon-pencil icon-white"></i> New Module</a></div></div></nav></div>';return out;
} },
    Profile:{ "profile-details":function anonymous(it) {
var out='<div class="mod mod-profile"></div>';return out;
},
      profile:function anonymous(it) {
var out='<div class="mod mod-profile">Profile</div>';return out;
} },
    Resources:{ "resources-list":function anonymous(it) {
var out='<h3>Module Specific</h3><ul class="thumbnails">';var arr1=it.resources;if(arr1){var resource,i1=-1,l1=arr1.length-1;while(i1<l1){resource=arr1[i1+=1];if(!resource.global){out+='<li class="span4"><div class="thumbnail"><a href="'+( resource.src )+'/'+( resource.name )+'.'+( resource.type )+'">'+( resource.name )+'</a><ul class="stats"><li class="size">'+( resource.size )+'</li><li class="created"><i class="icon-calendar"></i> '+( moment(resource.created).format('L') )+'</li></ul></div></li>';}} } out+='</ul><h3>Global</h3><div class="input-append"><input class="span2" type="text"><button class="btn" type="button"><i class="icon-search"/></button></div><span class="help-block">Search for global modules</span><ul class="thumbnails">';var arr2=it.resources;if(arr2){var resource,i2=-1,l2=arr2.length-1;while(i2<l2){resource=arr2[i2+=1];if(resource.global){out+='<li class="span4 resource" data-id="'+( resource._id )+'"><div class="thumbnail"><a href="javascript:;" class="btn btn-danger delete-resource"><i class="icon-trash icon-white"></i></a><a href="/js/module-deps/global/'+( resource.name )+'"><i class="icon-file"></i> '+( resource.name )+'</a><ul class="stats"><li class="size">'+( resource.size )+'</li><li class="created"><i class="icon-calendar"></i> '+( moment(resource.created).format('L') )+'</li></ul></div></li>';}} } out+='</ul>';return out;
},
      resources:function anonymous(it) {
var out='<div class="mod mod-resources"><input class="fileupload" type="file" name="files[]" data-url="/api/resources"/><div class="content"></div></div>';return out;
} } } };});