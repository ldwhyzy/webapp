const products = require('../products');

const APIError = require('../rest').APIError;

module.exports = {
    
    'GET /api/products': async (ctx, next) => {
        ctx.rest({
            products: products.getProducts()
        });
    },
/*
    'POST /api/products': async (ctx, next) => {
        var p = products.createProduct(ctx.request.body.name, ctx.request.body.manufacturer, parseFloat(ctx.request.body.price));
        ctx.rest(p);
    },
    */
    'GET /api/studies': async (ctx, next) => {
        var study_count = {study_count:58};//篇章数
        ctx.rest(study_count);
    },
    
    'GET /api/study/:id': async (ctx, next) => {
        var study_count = JSON.stringify({study_count:ctx.params.id});
        var page_flag = ctx.params.id;
        var blog_items = [{name:'第一篇技术博客', id:1, created_at:200001,summary:'本篇博客简要'+page_flag},
                          {name:'第一篇技术博客', id:2, created_at:200002,summary:'本篇博客简要'+page_flag},
                          {name:'第一篇技术博客', id:3, created_at:200003,summary:'本篇博客简要'+page_flag}];
        
        ctx.rest({studies:blog_items});
    },
    
    
/*
    'DELETE /api/products/:id': async (ctx, next) => {
        console.log(`delete product ${ctx.params.id}...`);
        var p = products.deleteProduct(ctx.params.id);
        if (p) {
            ctx.rest(p);
        } else {
            throw new APIError('product:not_found', 'product not found by id.');
        }
    }
    */
};