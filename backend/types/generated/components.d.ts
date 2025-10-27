import type { Schema, Struct } from '@strapi/strapi';

export interface ArticleImagesImageBlock extends Struct.ComponentSchema {
  collectionName: 'components_article_images_image_blocks';
  info: {
    displayName: 'ImageBlock';
    icon: 'landscape';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface ArticleImagesVideoEmbedBlock extends Struct.ComponentSchema {
  collectionName: 'components_article_images_video_embed_blocks';
  info: {
    displayName: 'VideoEmbedBlock';
    icon: 'monitor';
  };
  attributes: {
    embedCode: Schema.Attribute.Text;
  };
}

export interface SharedReviewDetails extends Struct.ComponentSchema {
  collectionName: 'components_shared_review_details';
  info: {
    displayName: 'reviewDetails';
    icon: 'star';
  };
  attributes: {
    cons: Schema.Attribute.Blocks;
    productName: Schema.Attribute.String & Schema.Attribute.Required;
    pros: Schema.Attribute.Blocks;
    rating: Schema.Attribute.Decimal;
    verdict: Schema.Attribute.Text;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'globe';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'article-images.image-block': ArticleImagesImageBlock;
      'article-images.video-embed-block': ArticleImagesVideoEmbedBlock;
      'shared.review-details': SharedReviewDetails;
      'shared.seo': SharedSeo;
    }
  }
}
