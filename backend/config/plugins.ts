export default ({ env }) => ({
  // Your existing oembed and email configs
  oembed: {
    enabled: true,
  },
  email: {
    config: {
      provider: 'strapi-provider-email-brevo',
      providerOptions: {
        apiKey: env('BREVO_API_KEY'),
      },
      settings: {
        defaultSenderEmail: 'razormascot@gmail.com',
        defaultSenderName: 'Aperture AI',
        defaultReplyTo: 'razormascot@gmail.com',
      },
    },
  },

  // --- Start: Comments Plugin Configuration ---
  comments: {
    enabled: true,
    config: {
      // Basic Features
      moderatorRoles: ["strapi-super-admin", "strapi-editor"],
      threading: true, // Enable nested replies

      // Reporting Feature
      reports: {
        enabled: true,
      },

      // Bad Words Feature
      badWords: {
        enabled: true,
        dictionary: ['examplebadword'], // Add your own words here
        badWords: '***', // Replacement text
      },

      // Content Type Relation (Crucial Part)
      relatedContentTypes: {
        // Ensure this exact string matches your Article collection UID
        'api::article.article': {
          enabled: true, // MUST be true
          label: 'Article Comments', // Optional label for the admin panel
          // These links are required for the plugin to work correctly
          links: [
            'api::article.article',
            'plugin::users-permissions.user'
          ],
        },
        // If you wanted comments on other types, add them here
        // 'api::your-other-type.your-other-type': { enabled: true, ... }
      },
    },
  },
  // --- End: Comments Plugin Configuration ---
});

