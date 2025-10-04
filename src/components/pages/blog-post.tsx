import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useCMS } from '../cms/cms-context';
import { 
  Calendar, 
  Clock, 
  User,
  ArrowLeft,
  Share2,
  BookOpen,
  ChevronRight,
  Heart,
  MessageCircle
} from 'lucide-react';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { getArticleBySlug, getPublishedArticles } = useCMS();
  
  const article = slug ? getArticleBySlug(slug) : null;
  const allArticles = getPublishedArticles();
  
  // Get related articles based on tags
  const relatedArticles = article ? 
    allArticles
      .filter(a => a.id !== article.id && a.tags.some(tag => article.tags.includes(tag)))
      .slice(0, 3) : [];

  if (!article) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            The article you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-4xl font-bold mb-6 mt-8">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mb-4 mt-8">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mb-3 mt-6">{line.slice(4)}</h3>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-bold mb-3">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="mb-2 ml-4">{line.slice(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-4 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Blog */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button asChild variant="ghost" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <article>
              {/* Header */}
              <div className="mb-8">
                <div className="mb-4">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                    {article.tags[0] || 'Article'}
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  {article.title}
                </h1>

                <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-600 dark:text-gray-300 mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {article.author}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(article.publishedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {article.readTime} min read
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4 mr-2" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                <Separator className="mb-8" />
              </div>

              {/* Featured Image */}
              {article.featuredImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-8"
                >
                  <div className="relative rounded-xl overflow-hidden">
                    <ImageWithFallback
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-64 md:h-96 object-cover"
                    />
                  </div>
                </motion.div>
              )}

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="prose prose-lg max-w-none dark:prose-invert mb-12"
              >
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {formatContent(article.content)}
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {/* Author Bio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {article.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">About {article.author}</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          Professional writer and academic expert specializing in educational content and student success strategies.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </article>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Article Info */}
            <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Article Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <strong>Published:</strong><br />
                  {new Date(article.publishedAt).toLocaleDateString()}
                </div>
                <div className="text-sm">
                  <strong>Reading Time:</strong><br />
                  {article.readTime} minutes
                </div>
                <div className="text-sm">
                  <strong>Author:</strong><br />
                  {article.author}
                </div>
                <div className="text-sm">
                  <strong>Status:</strong><br />
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    Published
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Share */}
            <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share This Article
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              </CardContent>
            </Card>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Card className="border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Related Articles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      to={`/blog/${relatedArticle.slug}`}
                      className="block group"
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm line-clamp-2">
                          {relatedArticle.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <Badge variant="outline" className="text-xs">
                            {relatedArticle.tags[0]}
                          </Badge>
                          <span>{relatedArticle.readTime} min</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}