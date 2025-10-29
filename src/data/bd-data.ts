interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  size?: number;
}

export interface BDFolder {
  name: string;
  path: string;
  coverImage?: string;
  pages?: string[];
  description?: string;
  createdAt?: string;
}

export async function getBDFolders(): Promise<BDFolder[]> {
  try {
    const response = await fetch('https://api.github.com/repos/La-grotte-de-Juju/La-grotte-de-Juju-Ressources/contents/BD', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      console.warn(`GitHub API error: ${response.status}, using fallback data`);
      return getStaticBDData();
    }

    const bdContents: GitHubFile[] = await response.json();
    
    const folders = bdContents.filter(item => item.type === 'dir');
    
    if (folders.length === 0) {
      console.warn('No BD folders found on GitHub, using fallback data');
      return getStaticBDData();
    }
    
    const bdData: BDFolder[] = await Promise.all(
      folders.map(async (folder) => {
        try {
          const folderResponse = await fetch(`https://api.github.com/repos/La-grotte-de-Juju/La-grotte-de-Juju-Ressources/contents/BD/${encodeURIComponent(folder.name)}`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
            next: { revalidate: 300 }
          });

          if (!folderResponse.ok) {
            console.warn(`Failed to fetch folder ${folder.name}`);
            return {
              name: folder.name,
              path: folder.path,
              pages: [],
              description: `BD "${folder.name}" - Erreur de chargement`,
              createdAt: new Date().toISOString(),
            };
          }

          const folderContents: GitHubFile[] = await folderResponse.json();
          
          const heroFile = folderContents.find(file => 
            file.type === 'file' && 
            file.name.toLowerCase() === 'hero.webp'
          );
          
          const imageFiles = folderContents
            .filter(file => 
              file.type === 'file' && 
              /\.(png|jpg|jpeg|gif|webp)$/i.test(file.name) &&
              file.name.toLowerCase() !== 'hero.webp'
            )
            .map(file => `https://raw.githubusercontent.com/La-grotte-de-Juju/La-grotte-de-Juju-Ressources/main/${file.path}`)
            .sort((a, b) => {
              const aNum = parseInt(a.match(/(\d+)/)?.[1] || '0');
              const bNum = parseInt(b.match(/(\d+)/)?.[1] || '0');
              return aNum - bNum;
            });

          const coverImage = heroFile 
            ? `https://raw.githubusercontent.com/La-grotte-de-Juju/La-grotte-de-Juju-Ressources/main/${heroFile.path}`
            : undefined;

          const descriptionFile = folderContents.find(file => 
            file.type === 'file' && 
            /^(description|readme)\.txt$/i.test(file.name)
          );
          
          let description = `Bande dessinée "${folder.name}"`;
          if (imageFiles.length > 0) {
            description += ` - ${imageFiles.length} pages`;
          }
          
          if (descriptionFile && descriptionFile.download_url) {
            try {
              const descResponse = await fetch(descriptionFile.download_url);
              if (descResponse.ok) {
                const descContent = await descResponse.text();
                description = descContent.trim() || description;
              }
            } catch (error) {
              console.warn(`Failed to fetch description for ${folder.name}`);
            }
          }

          return {
            name: folder.name,
            path: folder.path,
            coverImage,
            pages: imageFiles,
            description,
            createdAt: new Date().toISOString(),
          };

        } catch (error) {
          console.error(`Error processing folder ${folder.name}:`, error);
          return {
            name: folder.name,
            path: folder.path,
            pages: [],
            description: `BD "${folder.name}" - Erreur de chargement`,
            createdAt: new Date().toISOString(),
          };
        }
      })
    );

    const validBDData = bdData.sort((a, b) => a.name.localeCompare(b.name));

    console.log(`✅ ${validBDData.length} BD(s) chargée(s) depuis GitHub`);
    return validBDData;

  } catch (error) {
    console.error('Error fetching BD folders from GitHub:', error);
    console.log('Using fallback data');
    return getStaticBDData();
  }
}

function getStaticBDData(): BDFolder[] {
  return [
    {
      name: "Exemple BD",
      path: "BD/Exemple BD",
      description: "Exemple de bande dessinée - Données de test",
      pages: [],
      createdAt: new Date().toISOString(),
    }
  ];
}

