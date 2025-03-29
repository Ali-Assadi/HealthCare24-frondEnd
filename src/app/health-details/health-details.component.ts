import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-health-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './health-details.component.html',
  styleUrls: ['./health-details.component.css']
})
export class HealthDetailsComponent implements OnInit {
  section: string | null = null;
  articleContent: any;

  // Define health topics
  healthTopics: { [key: string]: any } = {
    'article-alzheimers': {
      title: "Is Alzheimer’s Hereditary?",
      image: "assets/health/alzheimer.webp",
      content: `
        <p><strong>Alzheimer's disease</strong> is a progressive brain disorder that affects memory, thinking, and behavior. It’s the most common cause of dementia, accounting for 60-80% of all dementia cases.</p>
        
        <p>Over time, individuals with Alzheimer's experience a decline in cognitive abilities, which impacts their ability to perform everyday tasks. The disease typically affects older adults, and the risk increases with age, but it is not a normal part of aging.</p>
        
        <h3>Genetic Component</h3>
        <p>Alzheimer’s disease does have a genetic component, but it is not entirely hereditary. While certain genes can increase the risk of developing Alzheimer's, having a family history of the disease doesn't guarantee that you will develop it. Some people with a family history never develop Alzheimer’s, while others who have no family history may develop it.</p>
        
        <h3>The Role of Genes</h3>
        <p>The most well-known gene linked to Alzheimer's is the <strong>APOE-e4 gene</strong>. People who inherit one copy of this gene have an increased risk of developing Alzheimer’s, while those with two copies of the gene have an even higher risk. However, not everyone who carries this gene develops Alzheimer’s.</p>
        
        <h3>Late-Onset Alzheimer’s</h3>
        <p>The most common form of Alzheimer’s is <strong>late-onset Alzheimer’s</strong>, which typically occurs after age 65. This form is influenced by a combination of genetic, environmental, and lifestyle factors. While the specific cause remains unclear, a buildup of amyloid plaques and tau tangles in the brain is thought to contribute to the disease. These abnormal structures disrupt brain cell communication and trigger inflammation.</p>
        
        <h3>Early-Onset Alzheimer’s</h3>
        <p>Some individuals develop Alzheimer’s at a younger age, typically between their 30s and mid-60s. This is known as <strong>early-onset Alzheimer's</strong>. The causes of early-onset Alzheimer’s are more often linked to genetic mutations that are inherited, which makes the disease more predictable in those cases.</p>
        
        <h3>Reducing the Risk</h3>
        <p>While there is no guaranteed way to prevent Alzheimer’s, research has shown that certain lifestyle changes may help reduce the risk of developing the disease, even for those with a genetic predisposition:</p>
        <ul>
          <li><strong>Stay mentally active:</strong> Engaging in activities that stimulate the brain, such as puzzles, reading, or learning new skills, may help maintain cognitive function.</li>
          <li><strong>Exercise regularly:</strong> Physical activity promotes blood flow to the brain, which may help reduce the risk of cognitive decline.</li>
          <li><strong>Eat a healthy diet:</strong> A balanced diet rich in fruits, vegetables, and healthy fats (such as the Mediterranean diet) can improve brain health.</li>
          <li><strong>Manage chronic conditions:</strong> Managing blood pressure, cholesterol, and diabetes can help lower the risk of Alzheimer’s.</li>
          <li><strong>Stay socially connected:</strong> Interacting with friends and family, as well as engaging in social activities, can help reduce stress and improve cognitive function.</li>
        </ul>
        
        <h3>Ongoing Research</h3>
        <p>Researchers are continuously studying Alzheimer’s disease to understand its causes and develop new treatments. Current research includes studying the role of the immune system in Alzheimer’s, exploring the benefits of drug treatments, and looking into lifestyle interventions that may prevent or slow down the disease.</p>
        
        <h3>Conclusion</h3>
        <p>While Alzheimer's remains an incurable disease, understanding the genetic and lifestyle factors that contribute to its development can help individuals take preventive measures. Early diagnosis and intervention can also improve the quality of life for individuals living with Alzheimer's and their families.</p>
      `
    },
    'article-women-live-longer': {
      title: "Scientists: Why Women Live Longer Than Men",
      image: "assets/health/Why Women Live Longer Than Men.jpg",
      content: `
        Studies suggest biological and lifestyle factors contribute to women's longer lifespan...
      `
    },
    'article-cholesterol-dementia': {
      title: "Cholesterol Changes Linked to Higher Dementia Risk",
      image: "assets/health/Cholesterol Changes Linked to Higher Dementia Risk.jpg",
      content: `
        New research finds that fluctuating cholesterol levels may increase the risk of cognitive decline and dementia over time.
      `
    },
    'article-memory-loss': {
      title: "Memory and Memory Loss, Explained",
      image: "assets/health/Memory and Memory Loss, Explained.jpg",
      content: `
        Memory loss can be a normal part of aging, but certain factors like stress, diet, and exercise influence cognitive function.
      `
    },
    'article-blood-test': {
      title: "This Blood Test for Alzheimer’s Is 90% Accurate",
      image: "assets/health/bloodTest.jpg",
      content: `
        Scientists have developed a blood test that detects early Alzheimer’s with high accuracy, offering hope for early diagnosis.
      `
    },
    'article-ozempic': {
      title: "Ozempic May Lower Your Risk of Cognitive Decline",
      image: "assets/health/Ozempic May Lower Your Risk of Cognitive Decline.jpg",
      content: `
        New studies show that diabetes medications like Ozempic might help protect brain health and reduce the risk of dementia.
      `
    }
  };

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.section = params['section'];
      this.loadArticleContent();
    });
  }

  loadArticleContent(): void {
    // If the section exists in healthTopics, load it; otherwise, show a default message.
    this.articleContent = this.healthTopics[this.section || 'alzheimers'] || {
      title: "Health Article Not Found",
      image: "assets/health/default.webp",
      content: "Sorry, the article you're looking for doesn't exist."
    };
  
    // Sanitize the content for security purposes
    this.articleContent.content = this.sanitizer.bypassSecurityTrustHtml(this.articleContent.content);
  }
  
}
